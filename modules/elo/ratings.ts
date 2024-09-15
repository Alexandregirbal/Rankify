// https://towardsdatascience.com/developing-an-elo-based-data-driven-ranking-system-for-2v2-multiplayer-games-7689f7d42a53

import { MinimalPlayer } from "../player/types";
import { calculateTeamsExpectations } from "./expectations";
import { calculateKFactor, calculatePFactor } from "./factors";
import { TeamScoring } from "./types";

const calculateResultPart = (
  team1: TeamScoring,
  team2: TeamScoring
): { team1: number; team2: number } => {
  const result = calculateTeamsExpectations(team1.players, team2.players);
  if (!result) throw new Error("Teams are not comparable");

  const { team1: team1Expectation, team2: team2Expectation } = result;
  const team1Won = team1.score > team2.score;

  return {
    team1: (team1Won ? 1 : 0) - team1Expectation,
    team2: (team1Won ? 0 : 1) - team2Expectation,
  };
};

export const calculatePlayersRatings = (
  team1: TeamScoring,
  team2: TeamScoring
): Array<MinimalPlayer> => {
  const resultPart = calculateResultPart(team1, team2);
  const gamePFactor = calculatePFactor(team1.score, team2.score);
  const newRatings = [];

  for (const player of team1.players) {
    const playerKFactor = calculateKFactor(player.games);
    const newRating =
      player.rating + playerKFactor * gamePFactor * resultPart.team1;
    newRatings.push({
      _id: player._id,
      name: player.name,
      rating: +newRating.toFixed(0),
      games: player.games + 1,
    });
  }

  for (const player of team2.players) {
    const playerKFactor = calculateKFactor(player.games);
    const newRating =
      player.rating + playerKFactor * gamePFactor * resultPart.team2;
    newRatings.push({
      _id: player._id,
      name: player.name,
      rating: +newRating.toFixed(0),
      games: player.games + 1,
    });
  }

  return newRatings;
};
