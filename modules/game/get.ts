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
