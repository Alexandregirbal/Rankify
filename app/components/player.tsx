import { Player } from "@/modules/elo/types";
import { Crown } from "lucide-react";
import LastGameStats from "./lastGameStats";

export default function PlayerComponent({
  player,
  ranking,
}: {
  player: Player;
  ranking: number;
}) {
  return (
    <div className="flex rounded-xl items-center gap-4 border bg-neutral-content border-base-300 p-4 w-full">
      <div className=" w-8 text-3xl text-center">{ranking}</div>
      <div className="flex justify-between grow">
        <div className="text-xl flex gap-4 items-center">
          {ranking === 1 ? <Crown /> : <></>} {player.name}
        </div>
        <div className="flex gap-2 items-center">
          <span>{player.rating}</span>
          <LastGameStats ratingHistory={player.ratingHistory} />
        </div>
      </div>
    </div>
  );
}
