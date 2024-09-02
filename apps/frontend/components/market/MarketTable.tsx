"use client";

import { Market } from "@repo/types/market";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMarketData, getTickers } from "../../utils/httpClient";
import MarketRow from "./MarketRow";

export const MarketTable = () => {
  const marketDataMap = new Map();
  const [market, setMarket] = useState<Market[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marketdata, tickers] = await Promise.all([
          getMarketData(),
          getTickers(),
        ]);

        marketdata.forEach((m) => marketDataMap.set(m.symbol.toLowerCase(), m));

        const updatedMarkets: Market[] = tickers.reduce<Market[]>(
          (acc, ticker) => {
            // @ts-ignore
            const symbol = ticker.symbol.split("_")[0].toLowerCase();
            const marketData = marketDataMap.get(symbol);

            if (marketData) {
              const { name, symbol, image, market_cap } = marketData;
              const {
                lastPrice: last_price,
                priceChangePercent,
                volume,
                quoteVolume,
              } = ticker;

              acc.push({
                name,
                symbol,
                image,
                market_cap,
                lastPrice: last_price,
                priceChangePercent,
                marketSymbol: ticker.symbol,
                quoteVolume,
              });
            }
            return acc;
          },
          [],
        );

        updatedMarkets.sort((a, b) => b.market_cap - a.market_cap);

        setMarket(updatedMarkets);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <table className="w-full table-auto">
      <thead>
        <tr>
          <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis first:pl-7 first:pr-0 last:pl-0 last:pr-7">
            <div className="flex items-center gap-1 cursor-pointer select-none">
              Name
              <span className="w-[16px]"></span>
            </div>
          </th>
          <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis first:pl-7 first:pr-0 last:pl-0 last:pr-7">
            <div className="flex items-center gap-1 cursor-pointer select-none">
              Price
              <span className="w-[16px]"></span>
            </div>
          </th>
          <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis first:pl-7 first:pr-0 last:pl-0 last:pr-7">
            <div className="flex items-center gap-1 cursor-pointer select-none">
              Market Cap
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-down h-4 w-4"
              >
                <path d="M12 5v14"></path>
                <path d="m19 12-7 7-7-7"></path>
              </svg>
            </div>
          </th>
          <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis first:pl-7 first:pr-0 last:pl-0 last:pr-7">
            <div className="flex items-center gap-1 cursor-pointer select-none">
              24h Volume
              <span className="w-[16px]"></span>
            </div>
          </th>
          <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis first:pl-7 first:pr-0 last:pl-0 last:pr-7">
            <div className="flex items-center gap-1 cursor-pointer select-none">
              24h Change
              <span className="w-[16px]"></span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {market.map((coin: Market, index) => {
          return (
            <MarketRow
              key={index}
              price={coin.lastPrice}
              symbol={coin.symbol}
              name={coin.name}
              market_cap={coin.market_cap}
              quoteVolume={coin.quoteVolume}
              image={coin.image}
              priceChangePercent={coin.priceChangePercent}
              marketSymbol={coin.marketSymbol}
              router={router}
            />
          );
        })}
      </tbody>
    </table>
  );
};
