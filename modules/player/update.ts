import mongooseConnect from "@/database/config/mongoose";
import { ZodObjectId } from "@/database/utils";
import { DEFAULT_RATING } from "../elo/constants";
import { playerModel } from "./model";
import { PlayerMongo } from "./types";

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

export const addPlayerTrophy = async ({
  player,
  ranking,
  seasonNumber,
}: {
  player: Pick<PlayerMongo, "_id" | "rating">;
  ranking: number;
  seasonNumber: number;
}) => {
  await mongooseConnect();

  const updateResult = await playerModel.updateOne(
    { _id: player._id },
    {
      $push: {
        trophies: { season: seasonNumber, ranking, rating: player.rating },
      },
    }
  );

  return updateResult;
};

export const resetPlayersRating = async ({
  activityId,
}: {
  activityId: ZodObjectId;
}) => {
  await mongooseConnect();

  const updatedResult = await playerModel.updateMany(
    { activityId },
    {
      $set: {
        rating: DEFAULT_RATING,
        games: 0,
        ratingHistory: [{ rating: DEFAULT_RATING, date: new Date() }],
      },
    },
    { new: true }
  );
  return updatedResult;
};
