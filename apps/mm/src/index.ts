import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.BASE_URL;
const TOTAL_BIDS = 15;
const TOTAL_ASK = 15;
const MARKET = "SAMSUNG_GBP";
const USER_ID = "5";

async function main() {
  console.log("Base URL: ", BASE_URL);
  const price = 1000 + Math.random() * 10;
  const openOrders = await axios.get(
    `${BASE_URL}/api/v1/order?userId=${USER_ID}&market=${MARKET}`,
  );

  const totalBids = openOrders.data.filter((o: any) => o.side === "buy").length;
  const totalAsks = openOrders.data.filter(
    (o: any) => o.side === "sell",
  ).length;

  const cancelledBids = await cancelBidsMoreThan(openOrders.data, price);
  const cancelledAsks = await cancelAsksLessThan(openOrders.data, price);

  let bidsToAdd = TOTAL_BIDS - totalBids - cancelledBids;
  let asksToAdd = TOTAL_ASK - totalAsks - cancelledAsks;

  while (bidsToAdd > 0 || asksToAdd > 0) {
    if (bidsToAdd > 0) {
      await axios.post(`${BASE_URL}/api/v1/order`, {
        market: MARKET,
        price: (price - Math.random() * 1).toFixed(1).toString(),
        quantity: "1",
        side: "buy",
        userId: USER_ID,
      });
      bidsToAdd--;
    }
    if (asksToAdd > 0) {
      await axios.post(`${BASE_URL}/api/v1/order`, {
        market: MARKET,
        price: (price + Math.random() * 1).toFixed(1).toString(),
        quantity: "1",
        side: "sell",
        userId: USER_ID,
      });
      asksToAdd--;
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  main();
}

async function cancelBidsMoreThan(openOrders: any[], price: number) {
  let promises: any[] = [];
  openOrders.map((o) => {
    if (o.side === "buy" && (o.price > price || Math.random() < 0.1)) {
      promises.push(
        axios.delete(`${BASE_URL}/api/v1/order`, {
          data: {
            orderId: o.orderId,
            market: MARKET,
          },
        }),
      );
    }
  });
  await Promise.all(promises);
  return promises.length;
}

async function cancelAsksLessThan(openOrders: any[], price: number) {
  let promises: any[] = [];
  openOrders.map((o) => {
    if (o.side === "sell" && (o.price < price || Math.random() < 0.5)) {
      promises.push(
        axios.delete(`${BASE_URL}/api/v1/order`, {
          data: {
            orderId: o.orderId,
            market: MARKET,
          },
        }),
      );
    }
  });

  await Promise.all(promises);
  return promises.length;
}

main();
