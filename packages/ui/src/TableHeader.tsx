const TableHeader = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-5 flex justify-between text-xs bg-black z-10">
      <div className="text-white ml-2">Price</div>
      <div className="text-slate-500">Size</div>
      <div className="text-slate-500 mr-2">Total</div>
    </div>
  );
};

export default TableHeader;
