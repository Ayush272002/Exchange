"use client";

import { useParams } from "next/navigation";
import Depth from "../../../components/depth/Depth";

export default function Page() {
  const { market } = useParams();

  return (
    <div className="flex flex-row flex-1">
      <div className="flex flex-col flex-1">
        {/* marketbar */}
        <div className="flex flex-row h-[920px] border-y border-slate-800">
          <div className="flex flex-col flex-1">{/* trade view */}</div>
          <div className="flex flex-col w-[250px] overflow-hidden">
            <Depth market={market as string} />
          </div>
        </div>
      </div>
      <div className="w-[10px] flex-col border-slate-800 border-l" />
      <div>
        <div className="flex flex-col w-[250px]">{/* swap ui */}</div>
      </div>
    </div>
  );
}
