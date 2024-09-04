import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// routes
import orderRouter from "./routes/orderRouter";
import depthRouter from "./routes/depthRouter";
import klineRouter from "./routes/klineRouter";
import tickerRouter from "./routes/tickerRouter";
import { tradesRouter } from "./routes/tradesRouter";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.use("/api/v1/order", orderRouter);
app.use("/api/v1/depth", depthRouter);
app.use("/api/v1/klines", klineRouter);
app.use("/api/v1/tickers", tickerRouter);
app.use("/api/v1/trades", tradesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
