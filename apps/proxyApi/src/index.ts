import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());

const targetUrl = process.env.API_URL;
const marketUrl = process.env.MARKET_URL;


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Expose-Headers", "Content-Length, Content-Range");
  next();
});

app.use(
  "/base",
  createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
  })
);

app.use(
  "/market",
  createProxyMiddleware({
    target: marketUrl,
    changeOrigin: true,
  })
);

const port = process.env.PORT || 8002;
app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
