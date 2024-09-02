"use client";

import { useEffect, useState } from "react";
import { getDepth, getTicker, getTrades } from "../../utils/httpClient";
import TableHeader from "@repo/ui/tableHeader";
import AskTable from "./AskTable";
import BidTable from "./BidTable";
import { SignalingManager } from "../../utils/SignalingManager";
import Ticker from "@repo/types/ticker";

const Depth = ({ market }: { market: string }) => {
  const [bids, setBids] = useState<[string, string][]>([]);
  const [asks, setAsks] = useState<[string, string][]>([]);
  const [price, setPrice] = useState<string>();

  useEffect(() => {
    SignalingManager.getInstance().registerCallback(
      "depth",
      (data: any) => {
        setBids((previousBids) => {
          let newBids = [...previousBids];
          for (let i = 0; i < data.bids.length; i++) {
            let found = false;
            for (let j = 0; j < previousBids.length; j++) {
              if (data.bids[i]?.[0] === previousBids[j]?.[0]) {
                // @ts-ignore
                newBids[j][1] = data.bids[i][1];
                found = true;
                break;
              }
            }
            if (!found) {
              newBids.push(data.bids[i]);
            }
          }
          // remove 0 quantity data
          newBids = newBids.filter((bid) => bid[1] !== "0.00");
          //reverse sort by pppu and take the first 15
          newBids = newBids
            .sort((a, b) => Number(b[0]) - Number(a[0]))
            .slice(0, 50);
          return newBids;
        });
        setAsks((previousAsks) => {
          let newAsks = previousAsks;
          for (let i = 0; i < data.asks.length; i++) {
            let found = false;
            for (let j = 0; j < previousAsks.length; j++) {
              if (data.asks[i][0] === previousAsks[j]?.[0]) {
                // @ts-ignore
                newAsks[j][1] = data.asks[i][1];
                found = true;
                break;
              }
            }
            if (!found) {
              newAsks.push(data.asks[i]);
            }
          }
          // remove 0 quantity data
          newAsks = newAsks.filter((ask) => ask[1] !== "0.00");
          // sort by ppu
          newAsks = newAsks
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .slice(0, 50);
          return newAsks;
        });
      },
      `Depth-${market}`,
    );

    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`depth.200ms.${market}`],
    });

    getDepth(market).then((d) => {
      setBids(d.bids.reverse());
      setAsks(d.asks);
    });

    SignalingManager.getInstance().registerCallback(
      "ticker",
      (data: Partial<Ticker>) => setPrice(data?.lastPrice),
      market,
    );
    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`depth.${market}`],
    });

    getTicker(market).then((t) => setPrice(t.lastPrice));
    getTrades(market).then((t) => setPrice(t[0]?.price));
    return () => {
      SignalingManager.getInstance().deRegisterCallback(
        "depth",
        `Depth-${market}`,
      );
      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`depth.200ms.${market}`],
      });
    };
  }, [market]);
  return (
    <div className="relative">
      <TableHeader />
      {asks && <AskTable asks={asks} />}
      {price && <div>{price}</div>}
      {bids && <BidTable bids={bids} />}
    </div>
  );
};

export default Depth;
