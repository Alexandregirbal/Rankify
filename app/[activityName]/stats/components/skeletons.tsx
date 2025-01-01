export const PlayerStatsSkeleton = () => {
  return (
    <>
      <li className="skeleton w-3/5 rounded-md h-6 mt-1"></li>
      <li className="skeleton w-3/4 rounded-md h-6 mt-1"></li>
      <li className="skeleton w-2/5 rounded-md h-6 mt-1"></li>
      <li className="skeleton w-3/5 rounded-md h-6 mt-1"></li>
      <li className="skeleton w-4/6 rounded-md h-6 mt-1"></li>
    </>
  );
};

export const PlayerQuoteSkeleton = () => {
  return <p className="skeleton w-full h-24"></p>;
};
