const PricePercent = ({
  priceChangePercent,
}: {
  priceChangePercent: string;
}) => {
  let number = parseFloat(priceChangePercent); // Convert string to number
  let percent = (number * 100).toFixed(2) + "%";

  return number < 0 ? (
    <p className="text-base font-medium tabular-nums text-redText">{percent}</p>
  ) : (
    <p className="text-base font-medium tabular-nums text-greenText">
      +{percent}
    </p>
  );
};

export default PricePercent;
