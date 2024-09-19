import mongooseConnect from "@/database/config/mongoose";
import { ZodObjectId } from "@/database/utils";
import { playerModel } from "./model";

export const updatePlayerRating = async ({
  playerId,
  newRating,
}: {
  playerId: ZodObjectId;
  newRating: number;
}) => {
  await mongooseConnect();
  const player = await playerModel.findOneAndUpdate(
    { _id: playerId },
    {
      $set: { rating: newRating },
      $inc: { games: 1 },
      $push: { ratingHistory: { rating: newRating, date: new Date() } },
    },
    { new: true }
  );
  return player;
};
