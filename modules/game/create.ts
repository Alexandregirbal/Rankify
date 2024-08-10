import { getDatabaseClient } from "@/database/db";

export const createGame = async (params: {
  player1Name: string;
  player2Name: string;
  scores: [number, number];
}) => {
  const db = getDatabaseClient();
  const game = await db.collection("games").insertOne({
    player1: params.player1Name,
    player2: params.player2Name,
    scores: params.scores,
    winner:
      params.scores[0] > params.scores[1]
        ? params.player1Name
        : params.player2Name,
  });
  return game;
};
