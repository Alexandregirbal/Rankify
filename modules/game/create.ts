import { getDatabaseClient } from "@/database/db";
import { TeamScoring } from "../elo/types";

export const createGame = async ({
  team1,
  team2,
}: {
  team1: TeamScoring;
  team2: TeamScoring;
}) => {
  const db = getDatabaseClient();
  const game = await db.collection("games").insertOne({
    team1: team1.players,
    team2: team2.players,
    scores: [team1.score, team2.score],
    winner: team1.score > team2.score ? "1" : "2",
  });
  return game;
};
