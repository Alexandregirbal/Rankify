import mongooseConnect from "@/database/config/mongoose";
import { ZodObjectId } from "@/database/utils";
import { playerModel } from "./model";
import { PlayerMongo } from "./types";

export const getPlayer = async ({ playerId }: { playerId: ZodObjectId }) => {
  await mongooseConnect();

  const player = await playerModel.findOne({ _id: playerId }).exec();
  return player?.toObject();
};

export const getPlayers = async ({
  playersIds,
}: {
  playersIds: ZodObjectId[];
}): Promise<PlayerMongo[]> => {
  await mongooseConnect();
  return playerModel.find({ _id: { $in: playersIds } }).lean();
};

export const getAllPlayersOfActivity = async ({
  activityId,
  minimumGames = 0,
}: {
  activityId: ZodObjectId;
  minimumGames?: number;
}): Promise<PlayerMongo[]> => {
  await mongooseConnect();

  const players = await playerModel
    .find(
      { activityId, $or: [{ games: { $gte: minimumGames } }, { games: 0 }] },
      null,
      {
        sort: { rating: -1 },
      }
    )
    .exec();

  return players.map((player) => player.toObject());
};

export const getAllPlayersRatingHistories = async ({
  activityId,
}: {
  activityId: ZodObjectId;
}): Promise<Array<Pick<PlayerMongo, "_id" | "userName" | "ratingHistory">>> => {
  await mongooseConnect();

  const players = await playerModel
    .find(
      { activityId },
      { _id: 1, userName: 1, ratingHistory: 1 },
      { sort: { rating: -1 } }
    )
    .exec();

  return players.map((player) => player.toObject());
};

export const getPlayerRatingHistory = async (
  playerId: PlayerMongo["_id"]
): Promise<PlayerMongo["ratingHistory"]> => {
  await mongooseConnect();

  const player = await playerModel
    .findOne({ _id: playerId }, { _id: 0, ratingHistory: 1 })
    .lean();

  return player ? player.ratingHistory : [];
};
