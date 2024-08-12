import { Player } from "@/modules/elo/types";
import { ChevronDown, ChevronUp, Crown } from "lucide-react";
export default function PlayerComponent({
  player,
  ranking,
}: {
  player: Player;
  ranking: number;
}) {
  const previousRating = player.ratingHistory
    ? player.ratingHistory[player.ratingHistory?.length - 2]?.rating
    : 0;
  const wonLastGame = previousRating < player.rating;

  return (
    <div className="shadow-md flex rounded-xl items-center gap-4 border border-slate-300 p-4 w-full">
      <div className=" w-8 text-3xl text-center">{ranking}</div>
      <div className="flex justify-between grow">
        <div className="text-xl flex gap-4 items-center">
          {ranking === 1 ? <Crown /> : <></>} {player.name}
        </div>
        <div className="flex gap-2 items-center">
          <span>{player.rating}</span>
          {wonLastGame ? (
            <ChevronUp color="green" />
          ) : (
            <ChevronDown color="red" />
          )}
        </div>
      </div>
    </div>
  );
}
