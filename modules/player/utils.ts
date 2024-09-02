import { DEFAULT_RATING } from "../elo/constants";
import { Player } from "../elo/types";

type CalculatePlayerStreakResult = {
  result: "win" | "loss" | "tie";
  count: number;
};

type CalculatePlayerStreak = (
  params: {
    ratingHistory: Player["ratingHistory"];
  } & Partial<CalculatePlayerStreakResult>
) => CalculatePlayerStreakResult;

export const calculatePlayerStreak: CalculatePlayerStreak = ({
  ratingHistory,
  result,
  count,
}) => {
  if (ratingHistory.length < 2)
    return { result: result ?? "tie", count: count ?? 0 };

  const currentRating =
    ratingHistory[ratingHistory.length - 1].rating ?? DEFAULT_RATING;
  const previousRating =
    ratingHistory[ratingHistory.length - 2].rating ?? DEFAULT_RATING;

  const lastGameResult =
    previousRating === currentRating
      ? "tie"
      : currentRating > previousRating
      ? "win"
      : "loss";

  if (result && lastGameResult !== result) return { result, count: count ?? 0 };

  return {
    result: lastGameResult,
    count: calculatePlayerStreak({
      ratingHistory: ratingHistory.slice(0, -1),
      result: lastGameResult,
      count: count ? count + 1 : 1,
    }).count,
  };
};

export const getLastGamePoints = (
  ratingHistory: Player["ratingHistory"]
): string => {
  if (ratingHistory.length <= 1) return "";
  const lastGamePoints = +(
    ratingHistory[ratingHistory.length - 1].rating -
    ratingHistory[ratingHistory.length - 2].rating
  ).toFixed(2);
  return lastGamePoints > 0 ? `+${lastGamePoints}` : lastGamePoints.toString();
};
