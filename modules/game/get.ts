import mongooseConnect from "@/database/config/mongoose";
import { PlayerMongo } from "../player/types";
import { gameModel } from "./model";
import { GameMongo } from "./types";

export const getTotalNumberOfGames = async ({
  playerId,
}: {
  playerId?: PlayerMongo["_id"];
}): Promise<number> => {
  await mongooseConnect();

  const conditions: Record<string, any> = {};

  if (playerId) {
    conditions.$or = [
      { "team1.playerId": playerId },
      { "team2.playerId": playerId },
    ];
  }

  return gameModel.countDocuments(conditions).lean();
};

export const getTotalNumberOfWins = async (
  playerId: PlayerMongo["_id"]
): Promise<number> => {
  await mongooseConnect();

  const [winsInTeam1, winsInTeam2] = await Promise.all([
    gameModel
      .countDocuments({ "team1.playerId": playerId, winner: "1" })
      .lean(),
    gameModel
      .countDocuments({ "team2.playerId": playerId, winner: "2" })
      .lean(),
  ]);

  return winsInTeam1 + winsInTeam2;
};

export const getNumberOfGamesSince = async ({
  since = new Date(2024, 0, 1),
  playerId,
}: {
  since?: Date;
  playerId?: PlayerMongo["_id"];
}) => {
  await mongooseConnect();

  const conditions: Record<string, any> = { createdAt: { $gte: since } };

  if (playerId) {
    conditions.$or = [
      { "team1.playerId": playerId },
      { "team2.playerId": playerId },
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
  playerId,
  since,
}: {
  playerId: PlayerMongo["_id"];
  since?: Date;
}): Promise<GameMongo[]> => {
  await mongooseConnect();
  return gameModel
    .find(
      {
        $or: [{ "team1.playerId": playerId }, { "team2.playerId": playerId }],
        ...(since ? { createdAt: { $gte: since } } : {}),
      },
      null,
      { sort: { createdAt: -1 } }
    )
    .lean();
};
