import { Request, Response } from "express";
import { pgClient } from "@repo/psql/psqlClient";

export const getKlines = async (req: Request, res: Response) => {
  const { market, interval, startTime, endTime } = req.query;

  let query;
  switch (interval) {
    case "1m":
      query = `SELECT * FROM klines_1m WHERE bucket >= $1 AND bucket <= $2`;
      break;
    case "1h":
      query = `SELECT * FROM klines_1m WHERE  bucket >= $1 AND bucket <= $2`;
      break;
    case "1w":
      query = `SELECT * FROM klines_1w WHERE bucket >= $1 AND bucket <= $2`;
      break;
    default:
      return res.status(400).send("Invalid interval");
  }

  try {
    const result = await pgClient().query(query, [
      //@ts-ignore
      new Date((startTime * 1000) as string),
      //@ts-ignore
      new Date((endTime * 1000) as string),
    ]);
    res.json(
      result.rows.map((x) => ({
        close: x.close,
        end: x.bucket,
        high: x.high,
        low: x.low,
        open: x.open,
        quoteVolume: x.quoteVolume,
        start: x.start,
        trades: x.trades,
        volume: x.volume,
      })),
    );
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
