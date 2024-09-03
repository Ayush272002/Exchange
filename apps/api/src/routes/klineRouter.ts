import { Router } from "express";
import { getKlines } from "../controllers/klineController";

const klineRouter = Router();

klineRouter.get("/", getKlines);

export default klineRouter;
