import { Player } from "@/modules/player/types";
import {
  calculatePlayerStreak,
  GameResult,
  getLastGamePoints,
} from "@/modules/player/utils";
import { ChevronDown, ChevronUp, Minus } from "lucide-react";

const getIcon = (result: GameResult) => {
  switch (result) {
    case "win":
      return <ChevronUp color="green" />;
    case "loss":
      return <ChevronDown color="red" />;
    default:
      return <Minus color="gray" />;
  }
};

const LastGameStats = ({
  ratingHistory,
}: {
  ratingHistory: Player["ratingHistory"];
}) => {
  const streak = calculatePlayerStreak({
    ratingHistory,
  });
  const lastGamePoints = getLastGamePoints({ ratingHistory });

  return (
    <div className="flex flex-col w-12">
      <div className="flex justify-center">
        {getIcon(streak.result)}
        {streak.count >= 1 ? streak.count : ""}
      </div>

      <span className="text-xs text-center">{lastGamePoints}</span>
    </div>
  );
};

export default LastGameStats;
