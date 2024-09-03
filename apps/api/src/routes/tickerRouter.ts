import { Router } from "express";
import { getTickers } from "../controllers/tickerController";

const tickerRouter = Router();

tickerRouter.get("/", getTickers);

export default tickerRouter;
