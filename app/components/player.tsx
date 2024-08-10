export default function Player({
  name,
  rating,
  ranking,
}: {
  name: string;
  rating: number;
  ranking: number;
}) {
  return (
    <div className="shadow-md flex rounded-md items-center gap-4 border border-slate-300 p-4 w-full">
      <div className="avatar">
        <div className="ring-2 ring-accent w-8 rounded-full text-center pt-1">
          {ranking}
        </div>
      </div>
      <div className="flex justify-between grow">
        <div>{name}</div>
        <div>{rating}</div>
      </div>
    </div>
  );
}
