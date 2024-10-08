const Bid = ({
  price,
  quantity,
  total,
  maxTotal,
}: {
  price: string;
  quantity: string;
  total: number;
  maxTotal: number;
}) => {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        backgroundColor: "transparent",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${(100 * total) / maxTotal}%`,
          height: "100%",
          background: "rgba(1, 167, 129, 0.325)",
          transition: "width 0.3s ease-in-out",
        }}
      ></div>
      <div className={`flex justify-between text-xs w-full`}>
        <div>{price}</div>
        <div>{quantity}</div>
        <div>{total.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default Bid;
