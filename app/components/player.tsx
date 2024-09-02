import { Player } from "@/modules/elo/types";
import {
  calculatePlayerStreak,
  getLastGamePoints,
} from "@/modules/player/utils";
import { ChevronDown, ChevronUp, Crown, Minus } from "lucide-react";
export default function PlayerComponent({
  player,
  ranking,
}: {
  player: Player;
  ranking: number;
}) {
  const getLastGameStateComponent = () => {
    const streak = calculatePlayerStreak({
      ratingHistory: player.ratingHistory,
    });
    switch (streak.result) {
      case "win":
        return (
          <div className="flex items-center gap-2">
            <ChevronUp color="green" />
            {streak.count}
          </div>
        );

      case "loss":
        return (
          <div className="flex justify-center">
            <ChevronDown color="red" />
          </div>
        );

      default:
        return (
          <div className="flex justify-center">
            <Minus color="gray" />
          </div>
        );
    }
  };

  const lastGamePoints = getLastGamePoints(player.ratingHistory);

  return (
    <div className="flex rounded-xl items-center gap-4 border bg-neutral-content border-base-300 p-4 w-full">
      <div className=" w-8 text-3xl text-center">{ranking}</div>
      <div className="flex justify-between grow">
        <div className="text-xl flex gap-4 items-center">
          {ranking === 1 ? <Crown /> : <></>} {player.name}
        </div>
        <div className="flex gap-2 items-center">
          <span>{player.rating}</span>
          <div className="flex flex-col w-12">
            {getLastGameStateComponent()}
            <span className="text-xs text-center">{lastGamePoints}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
