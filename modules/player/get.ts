import { getDatabaseClient } from "@/database/db";
import { revalidatePath } from "next/cache";
import { Player } from "../elo/types";

export const getAllPlayers = async (): Promise<Player[]> => {
  revalidatePath("/");
  const db = getDatabaseClient();
  const players = await db
    .collection("players")
    .find({})
    .sort({ rating: -1 })
    .toArray();
  return players as unknown as Player[];
};

export const getAllPlayersRatingHistories = async (): Promise<
  Array<Pick<Player, "name" | "ratingHistory">>
> => {
  revalidatePath("/charts");
  const db = getDatabaseClient();
  const players = await db
    .collection("players")
    .find({})
    .project({ _id: 0, name: 1, ratingHistory: 1 })
    .sort({ rating: -1 })
    .toArray();
  return players as unknown as Array<Pick<Player, "name" | "ratingHistory">>;
};

export const getPlayer = async (playerName: string) => {
  const db = getDatabaseClient();
  const player = await db.collection("players").findOne({ name: playerName });
  return player;
};
