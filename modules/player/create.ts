import mongooseConnect from "@/database/config/mongoose";
import { DEFAULT_RATING } from "@/modules/elo/constants";
import { playerModel } from "./model";
import { PlayerMongo } from "./types";

export const createPlayer = async (
  playerName: PlayerMongo["name"]
): Promise<PlayerMongo> => {
  await mongooseConnect();

  const player = await playerModel.findOne({ name: playerName });
  if (player) {
    throw new Error("Player already exists");
  }

  const newPlayer = await playerModel.create({
    name: playerName,
    rating: DEFAULT_RATING,
    ratingHistory: [{ date: new Date(), rating: DEFAULT_RATING }],
    games: 0,
  });

  return newPlayer;
};
