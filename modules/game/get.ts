import { getDatabaseClient } from "@/database/db";
import { revalidatePath } from "next/cache";

export const getTotalNumberOfGames = () => {
  revalidatePath("/charts");
  const db = getDatabaseClient();
  return db.collection("games").countDocuments();
};

export const getNumberOfGamesSince = async (
  since: Date = new Date(2024, 0, 1)
) => {
  revalidatePath("/charts");
  const db = getDatabaseClient();
  return db.collection("games").countDocuments({ createdAt: { $gte: since } });
};

import { getDatabaseClient } from "@/database/db";
import { revalidatePath } from "next/cache";
import { Player } from "../elo/types";

export const getAllGames = async (): Promise<Player[]> => {
  revalidatePath("/");
  const db = getDatabaseClient();
  const games = await db
    .collection("games")
    .find({})
    .sort({ rating: -1 })
    .toArray();
  return games as unknown as Player[];
};

export const getGames = async (playerName: string) => {
  const db = getDatabaseClient();
  const games = await db.collection("games").findMany({
    $or: [
      { team1: { $elemMatch: playerName } },
      { team2: { $elemMatch: playerName } },
    ],
  });
  return games;
};
