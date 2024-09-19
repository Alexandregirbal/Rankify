// https://towardsdatascience.com/developing-an-elo-based-data-driven-ranking-system-for-2v2-multiplayer-games-7689f7d42a53

import { GamePlayer } from "@/modules/game/types";
import { POWER, THRESHOLD } from "./constants";

export const calculateExpectation = (
  rating1: number,
  rating2: number
): number => {
  const rating1Expectation =
    1 / (1 + POWER ** ((rating2 - rating1) / THRESHOLD));
  return Number(rating1Expectation.toFixed(4));
};

/**
 * Calculates the expected ratings of two teams. The number of players in each team is not important.
 * The number of players in teams can differ (it can be 1v1, 2v1, 3v2 4v4, etc.)
 */
export const calculateTeamsExpectations = (
  team1: GamePlayer[],
  team2: GamePlayer[]
): {
  team1: number;
  team2: number;
} | null => {
  if (team1.length === 0 || team2.length === 0) return null;
  const team1Rating =
    team1.reduce((acc, cur) => acc + cur.rating, 0) / team1.length;
  const team2Rating =
    team2.reduce((acc, cur) => acc + cur.rating, 0) / team2.length;

  return {
    team1: calculateExpectation(team1Rating, team2Rating),
    team2: calculateExpectation(team2Rating, team1Rating),
  };
};
