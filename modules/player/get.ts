import mongooseConnect from "@/database/config/mongoose";
import { getDatabaseClient } from "@/database/db";
import { revalidatePath } from "next/cache";
import { playerModel } from "./model";
import { Player } from "./types";

export const getAllPlayers = async (): Promise<Player[]> => {
  revalidatePath("/");
  await mongooseConnect();
  const players = await playerModel
    .find(
      {},
      { _id: 0, name: 1, ratingHistory: 1, games: 1, rating: 1 },
      { sort: { rating: -1 } }
    )
    .lean();
  console.log(`~~~~~ Girbalog | getAllPlayers | players: `, players);

  return players;
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

export const getPlayerRatingHistory = async (
  playerName: string
): Promise<Player["ratingHistory"]> => {
  const db = getDatabaseClient();
  const players = await db
    .collection("players")
    .find({ name: playerName })
    .project({ _id: 0, ratingHistory: 1 })
    .limit(1)
    .toArray();
  return (
    players as unknown as Array<Pick<Player, "name" | "ratingHistory">>
  )[0]?.ratingHistory;
};
