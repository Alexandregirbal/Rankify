import { getDatabaseClient } from "@/database/db";
import { Game } from "./types";

export const getTotalNumberOfGames = ({
  playerName,
}: {
  playerName?: string;
}) => {
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

export const getTotalNumberOfWins = async (
  playerName: string
): Promise<number> => {
  const db = getDatabaseClient();

  const [winsInTeam1, winsInTeam2] = await Promise.all([
    db
      .collection("games")
      .countDocuments({ "team1.name": playerName, winner: "1" }),
    db
      .collection("games")
      .countDocuments({ "team2.name": playerName, winner: "2" }),
  ]);

  return winsInTeam1 + winsInTeam2;
};

export const getNumberOfGamesSince = async ({
  since = new Date(2024, 0, 1),
  playerName,
}: {
  since?: Date;
  playerName?: string;
}) => {
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

export const getGamesSince = async (since: Date) => {
  const db = getDatabaseClient();
  return db
    .collection("games")
    .find<Game>({ createdAt: { $gte: since } })
    .toArray();
};

export const getAllGames = async (): Promise<Game[]> => {
  const db = getDatabaseClient();
  const games = await db
    .collection("games")
    .find({})
    .sort({ rating: -1 })
    .toArray();
  return games as unknown as Game[];
};

export const getPlayerGames = async (playerName: string): Promise<Game[]> => {
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
