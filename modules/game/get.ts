import { getDatabaseClient } from "@/database/db";
import { revalidatePath } from "next/cache";
import { Game } from "./types";

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

export const getAllGames = async (): Promise<Game[]> => {
  revalidatePath("/");
  const db = getDatabaseClient();
  const games = await db
    .collection("games")
    .find({})
    .sort({ rating: -1 })
    .toArray();
  return games as unknown as Game[];
};

export const getGames = async (playerName: string): Promise<Game[]> => {
  const db = getDatabaseClient();
  const games = await db
    .collection("games")
    .find({
      $or: [{ "team1.name": playerName }, { "team2.name": playerName }],
    })
    .sort({ createdAt: -1 })
    .toArray();
  return games as unknown as Game[];
};
