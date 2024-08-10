import { DEFAULT_RATING } from "@/app/modules/elo/constants";
import { getDatabaseClient } from "@/database/db";

export const createPlayer = async (playerName: string) => {
  const db = getDatabaseClient();

  const player = await db.collection("players").findOne({ name: playerName });
  if (player) {
    throw new Error("Player already exists");
  }

  const newPlayer = await db
    .collection("players")
    .insertOne({ name: playerName, rating: DEFAULT_RATING, games: 0 });
  return newPlayer;
};
