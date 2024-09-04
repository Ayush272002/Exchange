import { pgClient } from "@repo/psql/psqlClient";
import { DbMessage } from "./types/types";
import { createClient } from "redis";

async function main() {
  const redisClient = createClient();
  await redisClient.connect();
  console.log("connected to redis");

  while (true) {
    const response = await redisClient.rPop("db_processor" as string);
    if (!response) {
    } else {
      const data: DbMessage = JSON.parse(response);
      if (data.type === "TRADE_ADDED") {
        console.log("adding data");
        console.log(data);
        const price = data.data.price;
        const timestamp = new Date(data.data.timestamp);
        const query =
          "INSERT INTO samsung_prices (time, price) VALUES ($1, $2)";
        const values = [timestamp, price];
        await pgClient().query(query, values);
      }
    }
  }
}
