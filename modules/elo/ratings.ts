// https://towardsdatascience.com/developing-an-elo-based-data-driven-ranking-system-for-2v2-multiplayer-games-7689f7d42a53

import { BASE_K_FACTOR } from "./constants";
import { calculateTeamsExpectations } from "./expectations";
import { calculateKFactor, calculatePFactor } from "./factors";
import { MinimalPlayer, NewPlayerRating, TeamScoring } from "./types";

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
): Array<NewPlayerRating> => {
  const resultPart = calculateResultPart(team1, team2);
  const gamePFactor = calculatePFactor(team1.score, team2.score);
  const newRatings: NewPlayerRating[] = [];

  for (const player of team1.players) {
    const playerKFactor = calculateKFactor(player.games);
    const newRating =
      player.rating + playerKFactor * gamePFactor * resultPart.team1;
    newRatings.push({
      ...player,
      games: player.games + 1,
      newRating: +newRating.toFixed(0),
    });
  }

  for (const player of team2.players) {
    const playerKFactor = calculateKFactor(player.games);
    const newRating =
      player.rating + playerKFactor * gamePFactor * resultPart.team2;
    newRatings.push({
      ...player,
      games: player.games + 1,
      newRating: +newRating.toFixed(0),
    });
  }

  return newRatings;
};

export const estimateBaseRating = (
  playersTeam1: MinimalPlayer[],
  playersTeam2: MinimalPlayer[]
): { team1wins: number; team2wins: number } | null => {
  if (!playersTeam1.length || !playersTeam2.length) return null;

  const resultPartTeam1Wins = calculateResultPart(
    {
      players: playersTeam1,
      score: 1,
    },
    {
      players: playersTeam2,
      score: 0,
    }
  );
  const resultPartTeam2Wins = calculateResultPart(
    {
      players: playersTeam1,
      score: 0,
    },
    {
      players: playersTeam2,
      score: 1,
    }
  );

  return {
    team1wins: +(BASE_K_FACTOR * resultPartTeam1Wins.team1).toFixed(0),
    team2wins: +(BASE_K_FACTOR * resultPartTeam2Wins.team2).toFixed(0),
  };
};
