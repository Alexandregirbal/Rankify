import { getDatabaseClient } from "@/database/db";
import { revalidatePath } from "next/cache";

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
