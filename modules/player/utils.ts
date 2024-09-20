import { DEFAULT_RATING } from "../elo/constants";
import { Player } from "./types";

export type GameResult = "win" | "loss" | "tie";

type CalculatePlayerStreakResult = {
  result: GameResult;
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

export const displayNumberWithSign = (number: number): string => {
  return number > 0 ? `+${number}` : number.toString();
};

export const getLastGamePoints = ({
  ratingHistory,
}: {
  ratingHistory: Player["ratingHistory"];
}): string | null => {
  if (ratingHistory.length <= 1) return null;

  const lastGamePoints = +(
    ratingHistory[ratingHistory.length - 1].rating -
    ratingHistory[ratingHistory.length - 2].rating
  ).toFixed(2);

  return displayNumberWithSign(lastGamePoints);
};

export const getExtremeRankings = (ratingHistory: Player["ratingHistory"]) => {
  return ratingHistory?.reduce(
    (acc, cur) => {
      if (acc.max < cur.rating) {
        acc.max = cur.rating;
      }
      if (acc.min > cur.rating) {
        acc.min = cur.rating;
      }
      return acc;
    },
    { max: DEFAULT_RATING, min: DEFAULT_RATING }
  );
};

export const getExtremPlayerStreak = ({
  ratingHistory,
}: {
  ratingHistory: Player["ratingHistory"];
}): {
  win: number;
  loss: number;
} => {
  const tmp = ratingHistory.reduce(
    (accumulator, currentValue, currentIndex, array) => {
      const previousValue = array[currentIndex - 1];
      if (!previousValue) return accumulator;

      const result =
        previousValue.rating < currentValue.rating ? "win" : "loss";

      if (result === "win") {
        if (accumulator.currentStreakType !== "win") {
          accumulator.currentStreakType = "win";
          accumulator.currentWinStreak = 0;
        }

        const newWinStreak = accumulator.currentWinStreak + 1;
        accumulator.currentWinStreak = newWinStreak;
        if (newWinStreak > accumulator.maxWin) {
          accumulator.maxWin = newWinStreak;
        }
      } else {
        if (accumulator.currentStreakType !== "loss") {
          accumulator.currentStreakType = "loss";
          accumulator.currentLossStreak = 0;
        }

        const newLossStreak = accumulator.currentLossStreak + 1;
        accumulator.currentLossStreak = newLossStreak;
        if (newLossStreak > accumulator.maxLoss) {
          accumulator.maxLoss = newLossStreak;
        }
      }
      return accumulator;
    },
    {
      maxWin: 0,
      maxLoss: 0,
      currentWinStreak: 0,
      currentLossStreak: 0,
      currentStreakType: "tie",
    }
  );
  return {
    win: tmp.maxWin,
    loss: tmp.maxLoss,
  };
};
