import { Request, Response } from "express";
import { RedisManager } from "../utils/RedisManager";
import { CANCEL_ORDER, CREATE_ORDER, GET_OPEN_ORDERS } from "../types";

const createOrder = async (req: Request, res: Response) => {
  const { market, price, quantity, side, userId } = req.body;
  // side -> buy / sell

  const response = await RedisManager.getInstance().sendAndAwait({
    type: CREATE_ORDER,
    data: {
      market,
      price,
      quantity,
      side,
      userId,
    },
  });

  res.json(response.payload);
};

const deleteOrder = async (req: Request, res: Response) => {
  const { orderId, market } = req.body;
  const response = await RedisManager.getInstance().sendAndAwait({
    type: CANCEL_ORDER,
    data: {
      orderId,
      market,
    },
  });

  res.json(response.payload);
};

const getOpenOrders = async (req: Request, res: Response) => {
  const response = await RedisManager.getInstance().sendAndAwait({
    type: GET_OPEN_ORDERS,
    data: {
      userId: req.query.userId as string,
      market: req.query.market as string,
    },
  });

  res.json(response.payload);
};

export { createOrder, deleteOrder, getOpenOrders };
