import { Request, Response } from "express";
import { RedisManager } from "../utils/RedisManager";
import { GET_DEPTH } from "../types";

export const getDepth = async (req: Request, res: Response) => {
  const { symbol } = req.query;
  const response = await RedisManager.getInstance().sendAndAwait({
    type: GET_DEPTH,
    data: {
      market: symbol as string,
    },
  });

  res.json(response.payload);
};
