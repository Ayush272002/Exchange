import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getOpenOrders,
} from "../controllers/orderController";

const orderRouter = Router();

orderRouter
  .post("/", createOrder)
  .delete("/", deleteOrder)
  .get("/", getOpenOrders);

export default orderRouter;
