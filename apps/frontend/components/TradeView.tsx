import { useEffect, useRef, useState } from "react";
import { ChartManager } from "../utils/chartManager";
import KLine from "@repo/types/kline";
import { getKlines } from "../utils/httpClient";
import { SignalingManager } from "../utils/SignalingManager";

const TradeView = ({ market }: { market: string }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager | null>(null);

  useEffect(() => {
    const init = async () => {
      let klineData: KLine[] = [];
      try {
        klineData = await getKlines(
          market,
          "1h",
          Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000),
          Math.floor(new Date().getTime() / 1000),
        );
      } catch (e) {}

      if (chartRef) {
        if (chartManagerRef.current) {
          chartManagerRef.current.destroy();
        }

        const chartManager = new ChartManager(
          chartRef.current,
          [
            ...klineData?.map((x) => ({
              close: parseFloat(x.close),
              high: parseFloat(x.high),
              low: parseFloat(x.low),
              open: parseFloat(x.open),
              timestamp: new Date(x.end),
            })),
          ].sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) || [],
          {
            background: "#0e0f14",
            color: "white",
          },
        );
        chartManagerRef.current = chartManager;
      }

      SignalingManager.getInstance().registerCallback(
        "kline",
        (data: any) => {
          chartManagerRef.current?.update(data);
        },
        `Kline-${market}`,
      );

      SignalingManager.getInstance().sendMessage({
        method: "SUBSCRIBE",
        params: [`kline.5m.${market}`],
      });

      return () => {
        SignalingManager.getInstance().deRegisterCallback(
          "kline",
          `Kline-${market}`,
        );
        SignalingManager.getInstance().sendMessage({
          method: "UNSUBSCRIBE",
          params: [`kline.5m.${market}`],
        });
      };
    };
    init();
  }, [market, chartRef]);

  return (
    <>
      <div
        ref={chartRef}
        style={{ height: "520px", width: "100%", marginTop: 4 }}
      ></div>
    </>
  );
};

export default TradeView;
