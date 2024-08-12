// https://towardsdatascience.com/developing-an-elo-based-data-driven-ranking-system-for-2v2-multiplayer-games-7689f7d42a53

import { calculateTeamsExpectations } from "./expectations";
import { calculateKFactor, calculatePFactor } from "./factors";
import { Player, Team } from "./types";

export const calculatePlayerRating = (
  player: Player,
  team: Team,
  result: [number, number],
  gamePFactor: number = 1
): { rating: number } => {
  const playerKFactor = calculateKFactor(player.games);

  const { team1: playerExpectation } = calculateTeamsExpectations(
    [player],
    team
  );
  const win = result[0] > result[1] ? 1 : 0;

  const rating =
    player.rating + playerKFactor * gamePFactor * (win - playerExpectation);
  return {
    rating: Number(rating.toFixed(2)),
  };
};

export const calculatePlayersRatings = (
  team1: Team,
  team2: Team,
  result: [number, number]
): Array<Omit<Player, "ratingHistory">> => {
  const newRatings = [];
  const gamePFactor = calculatePFactor(result[0], result[1]);
  for (const player of team1) {
    const { rating: newRating } = calculatePlayerRating(
      player,
      team2,
      result,
      gamePFactor
    );
    newRatings.push({
      rating: newRating,
      name: player.name,
      games: player.games + 1,
    });
  }

  for (const player of team2) {
    const { rating: newRating } = calculatePlayerRating(
      player,
      team1,
      [result[1], result[0]],
      gamePFactor
    );
    newRatings.push({
      rating: newRating,
      name: player.name,
      games: player.games + 1,
    });
  }

  return newRatings;
};
