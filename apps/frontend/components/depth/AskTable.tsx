import Ask from "@repo/ui/ask";

const AskTable = ({ asks }: { asks: [string, string][] }) => {
  let currentTotal = 0;
  const relevantAsks = asks.slice(0, 15);
  relevantAsks.reverse();

  let asksWithTotal: [string, string, number][] = [];
  for (let i = relevantAsks.length - 1; i >= 0; i--) {
    const ask = relevantAsks[i];
    if (ask) {
      const [price, quantity] = ask;
      asksWithTotal.push([price, quantity, (currentTotal += Number(quantity))]);
    }
  }
  const maxTotal = relevantAsks.reduce(
    (acc, [_, quantity]) => acc + Number(quantity),
    0,
  );
  asksWithTotal.reverse();
  return (
    <div>
      {asksWithTotal.map(([price, quantity, total]) => (
        <Ask
          maxTotal={maxTotal}
          key={price}
          price={price}
          quantity={quantity}
          total={total}
        />
      ))}
    </div>
  );
};

export default AskTable;
