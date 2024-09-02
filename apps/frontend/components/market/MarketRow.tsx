import { formatMarketCap } from "../../utils/formatMarketCap";
import PricePercent from "./PricePercent";

const MarketRow = ({
  price,
  symbol,
  name,
  market_cap,
  image,
  priceChangePercent,
  quoteVolume,
  marketSymbol,
  router,
}: {
  price: string;
  symbol: string;
  name: string;
  market_cap: number;
  image: string;
  priceChangePercent: string;
  quoteVolume: string;
  marketSymbol: string;
  router: any;
}) => {
  return (
    <tr
      className="cursor-pointer border-t border-baseBorderLight hover:bg-slate-800"
      onClick={() => router.push(`/trade/${marketSymbol}`)}
    >
      <td className="px-2 py-3 first:pl-7 first:pr-0 last:pl-0 last:pr-7">
        <div className="flex shrink">
          <div className="flex items-center undefined">
            <div className="relative flex-none overflow-hidden rounded-full border border-baseBorderMed w-10 h-10">
              <div className="relative">
                <img
                  alt={`${name} Logo`}
                  loading="lazy"
                  width="40"
                  height="40"
                  decoding="async"
                  data-nimg="1"
                  className=""
                  src={image}
                />
              </div>
            </div>
            <div className="ml-4 flex flex-col">
              <p className="whitespace-nowrap text-base font-medium text-baseTextHighEmphasis">
                {name}
              </p>
              <div className="flex items-center justify-start flex-row gap-2">
                <p className="flex-medium text-left text-xs leading-5 text-baseTextMedEmphasis">
                  {symbol.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </td>
      <td className="px-2 py-3 first:pl-7 first:pr-0 last:pl-0 last:pr-7">
        <p className="text-base font-medium tabular-nums">${price}</p>
      </td>
      <td className="px-2 py-3 first:pl-7 first:pr-0 last:pl-0 last:pr-7">
        <p className="text-base font-medium tabular-nums">
          {formatMarketCap(market_cap)}
        </p>
      </td>
      <td className="px-2 py-3 first:pl-7 first:pr-0 last:pl-0 last:pr-7">
        <p className="text-base font-medium tabular-nums">
          {formatMarketCap(Number(quoteVolume))}
        </p>
      </td>
      <td className="px-2 py-3 first:pl-7 first:pr-0 last:pl-0 last:pr-7">
        <PricePercent priceChangePercent={priceChangePercent} />
      </td>
    </tr>
  );
};

export default MarketRow;
