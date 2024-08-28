import { Player } from "@/modules/elo/types";
import { calculatePlayerStreak } from "@/modules/player/utils";
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
          <>
            <ChevronUp color="green" />
            {streak.count}
          </>
        );

      case "loss":
        return (
          <>
            <ChevronDown color="red" />
            {streak.count}
          </>
        );

      default:
        return <Minus color="gray" />;
    }
  };

  return (
    <div className="flex rounded-xl items-center gap-4 border bg-neutral-content border-base-300 p-4 w-full">
      <div className=" w-8 text-3xl text-center">{ranking}</div>
      <div className="flex justify-between grow">
        <div className="text-xl flex gap-4 items-center">
          {ranking === 1 ? <Crown /> : <></>} {player.name}
        </div>
        <div className="flex gap-2 items-center">
          <span>{player.rating}</span>
          {getLastGameStateComponent()}
        </div>
      </div>
    </div>
  );
}
