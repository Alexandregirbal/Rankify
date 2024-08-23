// https://towardsdatascience.com/developing-an-elo-based-data-driven-ranking-system-for-2v2-multiplayer-games-7689f7d42a53

import { calculateTeamsExpectations } from "./expectations";
import { calculateKFactor, calculatePFactor } from "./factors";
import { Player, Team, TeamScoring } from "./types";

export const calculatePlayerRating = (
  player: Player,
  team: Team,
  result: [number, number],
  gamePFactor: number = 1
): { rating: number } => {
  const playerKFactor = calculateKFactor(player.games);

  const expectations = calculateTeamsExpectations([player], team);
  if (!expectations) return { rating: player.rating };

  const win = result[0] > result[1] ? 1 : 0;

  const rating =
    player.rating + playerKFactor * gamePFactor * (win - expectations.team1);
  return {
    rating: Number(rating.toFixed(2)),
  };
};

export const calculatePlayersRatings = (
  team1: TeamScoring,
  team2: TeamScoring
): Array<Omit<Player, "ratingHistory">> => {
  const newRatings = [];
  const gamePFactor = calculatePFactor(team1.score, team2.score);
  for (const player of team1.players) {
    const { rating: newRating } = calculatePlayerRating(
      player,
      team2.players,
      [team1.score, team2.score],
      gamePFactor
    );
    newRatings.push({
      rating: newRating,
      name: player.name,
      games: player.games + 1,
    });
  }

  for (const player of team2.players) {
    const { rating: newRating } = calculatePlayerRating(
      player,
      team1.players,
      [team2.score, team1.score],
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
