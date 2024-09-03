import { Router } from "express";
import { getDepth } from "../controllers/depthController";

const depthRouter = Router();

depthRouter.get("/", getDepth);

export default depthRouter;
