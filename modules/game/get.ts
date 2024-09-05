import { getDatabaseClient } from "@/database/db";
import { revalidatePath } from "next/cache";
import { Game } from "./types";

export const getTotalNumberOfGames = ({
  playerName,
}: {
  playerName?: string;
}) => {
  revalidatePath("/charts");
  const db = getDatabaseClient();

  const conditions: Record<string, any> = {};

  if (playerName) {
    conditions.$or = [
      { "team1.name": playerName },
      { "team2.name": playerName },
    ];
  }

  return db.collection("games").countDocuments(conditions);
};

type GetNumberOfGamesSinceParams = {
  since?: Date;
  playerName?: string;
};

export const getNumberOfGamesSince = async ({
  since = new Date(2024, 0, 1),
  playerName,
}: GetNumberOfGamesSinceParams) => {
  revalidatePath("/charts");
  const db = getDatabaseClient();

  const conditions: Record<string, any> = { createdAt: { $gte: since } };

  if (playerName) {
    conditions.$or = [
      { "team1.name": playerName },
      { "team2.name": playerName },
    ];
  }

  return db.collection("games").countDocuments(conditions);
};

export const getGames = async (since: Date) => {
  revalidatePath("/charts");
  const db = getDatabaseClient();
  return db
    .collection("games")
    .find<Game>({ createdAt: { $gte: since } })
    .toArray();
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
