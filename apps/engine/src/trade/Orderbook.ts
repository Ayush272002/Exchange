import { Fill } from "../interface/Fill";
import { Order } from "../interface/Order";
import { BASE_CURRENCY } from "./Engine";

export class Orderbook {
  bids: Order[];
  asks: Order[];
  baseAsset: string;
  quoteAsset: string = BASE_CURRENCY;
  lastTradeId: number;
  currentPrice: number;

  constructor(
    baseAsset: string,
    bids: Order[],
    asks: Order[],
    lastTradeId: number,
    currentPrice: number,
  ) {
    this.bids = bids;
    this.asks = asks;
    this.baseAsset = baseAsset;
    this.lastTradeId = lastTradeId || 0;
    this.currentPrice = currentPrice || 0;
  }

  ticker() {
    return `${this.baseAsset}_${this.quoteAsset}`;
  }

  getSnapshot() {
    return {
      baseAsset: this.baseAsset,
      bids: this.bids,
      asks: this.asks,
      lastTradeId: this.lastTradeId,
      currentPrice: this.currentPrice,
    };
  }

  addOrder(order: Order): {
    executedQty: number;
    fills: Fill[];
  } {
    if (order.side === "buy") {
      const { executedQty, fills } = this.matchBid(order);
      order.filled = executedQty;
      if (executedQty === order.quantity) {
        return {
          executedQty,
          fills,
        };
      }

      this.bids.push(order);
      return {
        executedQty,
        fills,
      };
    } else {
      const { executedQty, fills } = this.matchAsk(order);
      order.filled = executedQty;
      if (executedQty === order.quantity) {
        return {
          executedQty,
          fills,
        };
      }

      this.asks.push(order);
      return {
        executedQty,
        fills,
      };
    }
  }

  matchBid(order: Order): { fills: Fill[]; executedQty: number } {
    const fills: Fill[] = [];
    let executedQty = 0;

    for (let i = 0; i < this.asks.length; i++) {
      const askOrder = this.asks[i];
      if (
        askOrder &&
        askOrder.price <= order.price &&
        executedQty < order.quantity
      ) {
        const filledQty = Math.min(
          order.quantity - executedQty,
          askOrder.quantity,
        );
        executedQty += filledQty;
        askOrder.filled += filledQty;
        fills.push({
          price: askOrder.price.toString(),
          qty: filledQty,
          tradeId: this.lastTradeId++,
          otherUserId: askOrder.userId,
          markerOrderId: askOrder.orderId,
        });
      }
    }

    for (let i = 0; i < this.asks.length; i++) {
      const askOrder = this.asks[i];
      if (askOrder && askOrder.filled === askOrder.quantity) {
        this.asks.splice(i, 1);
        i--;
      }
    }
    return {
      fills,
      executedQty,
    };
  }

  matchAsk(order: Order): { fills: Fill[]; executedQty: number } {
    const fills: Fill[] = [];
    let executedQty = 0;

    for (let i = 0; i < this.bids.length; i++) {
      const bidOrder = this.bids[i];
      if (
        bidOrder &&
        bidOrder.price >= order.price &&
        executedQty < order.quantity
      ) {
        const amountRemaining = Math.min(
          order.quantity - executedQty,
          bidOrder.quantity,
        );
        executedQty += amountRemaining;
        bidOrder.filled += amountRemaining;
        fills.push({
          price: bidOrder.price.toString(),
          qty: amountRemaining,
          tradeId: this.lastTradeId++,
          otherUserId: bidOrder.userId,
          markerOrderId: bidOrder.orderId,
        });
      }
    }

    for (let i = 0; i < this.bids.length; i++) {
      const bidOrder = this.bids[i];
      if (bidOrder && bidOrder.filled === bidOrder.quantity) {
        this.bids.splice(i, 1);
        i--;
      }
    }

    return {
      fills,
      executedQty,
    };
  }

  getDepth() {
    const bids: [string, string][] = [];
    const asks: [string, string][] = [];

    const bidsObj: { [key: string]: number } = {};
    const asksObj: { [key: string]: number } = {};

    for (let i = 0; i < this.bids.length; i++) {
      const order = this.bids[i];
      if (order) {
        const priceKey = order.price.toString();
        if (!bidsObj[priceKey]) {
          bidsObj[priceKey] = 0;
        }
        bidsObj[priceKey] += order.quantity;
      }
    }

    for (let i = 0; i < this.asks.length; i++) {
      const order = this.asks[i];
      if (order) {
        const priceKey = order.price.toString();
        if (!asksObj[priceKey]) {
          asksObj[priceKey] = 0;
        }
        asksObj[priceKey] += order.quantity;
      }
    }

    for (const price in bidsObj) {
      if (bidsObj.hasOwnProperty(price)) {
        const priceKey = price.toString();
        if (!bidsObj[priceKey]) {
          bidsObj[priceKey] = 0;
        }
        bids.push([price, bidsObj[priceKey].toString()]);
      }
    }

    for (const price in asksObj) {
      if (asksObj.hasOwnProperty(price)) {
        const priceKey = price.toString();
        if (!asksObj[priceKey]) {
          asksObj[priceKey] = 0;
        }
        asks.push([price, asksObj[priceKey].toString()]);
      }
    }

    return {
      bids,
      asks,
    };
  }

  getOpenOrders(userId: string): Order[] {
    const asks = this.asks.filter((x) => x.userId === userId);
    const bids = this.bids.filter((x) => x.userId === userId);
    return [...asks, ...bids];
  }

  cancelBid(order: Order) {
    const index = this.bids.findIndex((x) => x.orderId === order.orderId);
    if (index !== -1) {
      const bidsIdx = this.bids[index];
      if (bidsIdx) {
        const price = bidsIdx.price;
        this.bids.splice(index, 1);
        return price;
      }
    }
  }

  cancelAsk(order: Order) {
    const index = this.asks.findIndex((x) => x.orderId === order.orderId);
    if (index !== -1) {
      const asksIdx = this.asks[index];
      if (asksIdx) {
        const price = asksIdx.price;
        this.asks.splice(index, 1);
        return price;
      }
    }
  }
}
