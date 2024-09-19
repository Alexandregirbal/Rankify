import mongooseConnect from "@/database/config/mongoose";
import { TeamScoring } from "../elo/types";
import { gameModel } from "./model";
import { GameMongo } from "./types";
import { getEliminationFoul } from "./utils";

export const createGame = async ({
  team1,
  team2,
}: {
  team1: TeamScoring;
  team2: TeamScoring;
}): Promise<GameMongo> => {
  await mongooseConnect();

  const eliminationFoul = getEliminationFoul([team1, team2]);

  return gameModel.create({
    team1: team1.players,
    team2: team2.players,
    scores: [team1.score, team2.score],
    winner: team1.score > team2.score ? "1" : "2",
    ...(eliminationFoul !== null && { eliminationFoul }),
  });
};
