import { Request, Response } from "express";
import { pgClient } from "@repo/psql/psqlClient";

export const getTickers = async (req: Request, res: Response) => {
  // const { market } = req.query;

  // if (!market) {
  //   return res.status(400).send("Market is required");
  // }

  // const query = `
  //   SELECT
  //     last_price as "lastPrice",
  //     high,
  //     low,
  //     volume,
  //     quote_volume as "quoteVolume",
  //     price_change as "priceChange",
  //     price_change_percent as "priceChangePercent",
  //     trades,
  //     symbol
  //   FROM tickers
  //   WHERE symbol = $1
  // `;

  // try {
  //   const result = await pgClient().query(query, [market]);
  //   if (result.rows.length === 0) {
  //     return res.status(404).send("Ticker not found");
  //   }

  //   res.json(result.rows[0]);
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).send("Error retrieving ticker data");
  // }

  res.json({});
};
