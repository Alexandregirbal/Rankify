import mongooseConnect from "@/database/config/mongoose";
import { playerModel } from "./model";
import { PlayerMongo } from "./types";

export const getAllPlayers = async (): Promise<PlayerMongo[]> => {
  await mongooseConnect();
  return playerModel
    .find(
      {},
      { _id: 0, name: 1, ratingHistory: 1, games: 1, rating: 1 },
      { sort: { rating: -1 } }
    )
    .lean();
};

export const getAllPlayersRatingHistories = async (): Promise<
  Array<Pick<PlayerMongo, "name" | "ratingHistory">>
> => {
  await mongooseConnect();
  return playerModel
    .find({}, { _id: 0, name: 1, ratingHistory: 1 }, { sort: { rating: -1 } })
    .lean();
};

export const getPlayer = async (
  playerName: string
): Promise<PlayerMongo | null> => {
  await mongooseConnect();
  return playerModel.findOne({ name: playerName }).lean();
};

export const getPlayerRatingHistory = async (
  playerName: string
): Promise<PlayerMongo["ratingHistory"]> => {
  await mongooseConnect();
  const player = await playerModel
    .findOne({ name: playerName }, { _id: 0, ratingHistory: 1 })
    .lean();

  return player ? player.ratingHistory : [];
};
