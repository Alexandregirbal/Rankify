import { getDatabaseClient } from "@/database/db";

export const getAllPlayers = async () => {
  const db = getDatabaseClient();
  const players = await db
    .collection("players")
    .find({})
    .sort({ rating: -1 })
    .toArray();
  return players;
};

export const getPlayer = async (playerName: string) => {
  const db = getDatabaseClient();
  const player = await db.collection("players").findOne({ name: playerName });
  return player;
};
