import mongooseConnect from "@/database/config/mongoose";
import { playerModel } from "./model";

export const updatePlayerRating = async (
  playerName: string,
  rating: number
) => {
  await mongooseConnect();
  const player = await playerModel.findOneAndUpdate(
    { name: playerName },
    {
      $set: { rating },
      $inc: { games: 1 },
      $push: { ratingHistory: { rating, date: new Date() } },
    },
    { new: true }
  );
  return player;
};
