import { getDatabaseClient } from "@/database/db";
import { DEFAULT_RATING } from "@/modules/elo/constants";

export const createPlayer = async (playerName: string) => {
  const db = getDatabaseClient();

  const player = await db.collection("players").findOne({ name: playerName });
  if (player) {
    throw new Error("Player already exists");
  }

  const newPlayer = await db.collection("players").insertOne({
    name: playerName,
    rating: DEFAULT_RATING,
    ratingHistory: [{ date: new Date(), rating: DEFAULT_RATING }],
    games: 0,
  });
  return newPlayer;
};
