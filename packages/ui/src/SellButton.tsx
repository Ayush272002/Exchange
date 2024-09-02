const SellButton = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: any;
}) => {
  return (
    <div
      className={`flex flex-col mb-[-2px] flex-1 cursor-pointer justify-center border-b-2 p-4 ${activeTab === "sell" ? "border-b-redBorder bg-redBackgroundTransparent" : "border-b-baseBorderMed hover:border-b-baseBorderFocus"}`}
      onClick={() => setActiveTab("sell")}
    >
      <p
        className="text-center text-sm font-semibold"
        style={{ color: "rgb(253, 75, 78)" }}
      >
        Sell
      </p>
    </div>
  );
};

export default SellButton;
