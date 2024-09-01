import axios from "axios";
import Depth from "@repo/types/depth";
import KLine from "@repo/types/kline";
import Ticker from "@repo/types/ticker";
import Trade from "@repo/types/trade";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getTicker(market: string): Promise<Ticker> {
  const tickers = await getTickers();
  const ticker = tickers.find((t) => t.symbol === market);
  if (!ticker) {
    throw new Error(`Ticker not found for market ${market}`);
  }

  return ticker;
}

export async function getTickers(): Promise<Ticker[]> {
  const res = await axios.get(`${BASE_URL}/api/v1/tickers`);
  return res.data;
}

export async function getDepth(market: string): Promise<Depth> {
  console.log(BASE_URL);
  const res = await axios.get(`${BASE_URL}/api/v1/depth?symbol=${market}`);
  return res.data;
}

export async function getTrades(market: string): Promise<Trade[]> {
  const res = await axios.get(`${BASE_URL}/api/v1/trades?symbol=${market}`);
  return res.data;
}

export async function getKlines(
  market: string,
  interval: string,
  startTime: number,
  endTime: number,
): Promise<KLine[]> {
  const res = await axios.get(
    `${BASE_URL}/api/v1/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`,
  );
  const data: KLine[] = res.data;
  return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}
