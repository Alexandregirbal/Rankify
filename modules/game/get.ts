import mongooseConnect from "@/database/config/mongoose";
import { Player } from "../player/types";
import { gameModel } from "./model";
import { GameMongo } from "./types";

export const getTotalNumberOfGames = async ({
  playerName,
}: {
  playerName?: string;
}): Promise<number> => {
  await mongooseConnect();

  const conditions: Record<string, any> = {};

  if (playerName) {
    conditions.$or = [
      { "team1.name": playerName },
      { "team2.name": playerName },
    ];
  }

  return gameModel.countDocuments(conditions).lean();
};

export const getTotalNumberOfWins = async (
  playerName: string
): Promise<number> => {
  await mongooseConnect();

  const [winsInTeam1, winsInTeam2] = await Promise.all([
    gameModel.countDocuments({ "team1.name": playerName, winner: "1" }).lean(),
    gameModel.countDocuments({ "team2.name": playerName, winner: "2" }).lean(),
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
  await mongooseConnect();

  const conditions: Record<string, any> = { createdAt: { $gte: since } };

  if (playerName) {
    conditions.$or = [
      { "team1.name": playerName },
      { "team2.name": playerName },
    ];
  }

  return gameModel.countDocuments(conditions).lean();
};

export const getGamesSince = async (since: Date): Promise<GameMongo[]> => {
  await mongooseConnect();
  return gameModel.find({ createdAt: { $gte: since } }).lean();
};

export const getAllGames = async (): Promise<GameMongo[]> => {
  await mongooseConnect();
  return gameModel.find({}, null, { sort: { rating: -1 } }).lean();
};

export const getPlayerGames = async ({
  playerName,
  since,
}: {
  playerName: Player["name"];
  since?: Date;
}): Promise<GameMongo[]> => {
  await mongooseConnect();
  return gameModel
    .find(
      {
        $or: [{ "team1.name": playerName }, { "team2.name": playerName }],
        ...(since ? { createdAt: { $gte: since } } : {}),
      },
      null,
      { sort: { createdAt: -1 } }
    )
    .lean();
};
