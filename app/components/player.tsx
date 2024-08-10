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
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4">
        <div>{ranking}</div>
        {name}
      </div>
      {rating}
    </div>
  );
}
