import mongooseConnect from "@/database/config/mongoose";
import { DEFAULT_RATING } from "@/modules/elo/constants";
import { activityModel } from "../activity/model";
import { ActivityMongo } from "../activity/types";
import { userModel } from "../user/model";
import { UserMongo } from "../user/types";
import { playerModel } from "./model";
import { PlayerMongo } from "./types";

export const createPlayer = async ({
  userId,
  activityId,
}: {
  userId: UserMongo["_id"];
  activityId: ActivityMongo["_id"];
}): Promise<PlayerMongo> => {
  await mongooseConnect();

  const player = await playerModel.findOne({ userId, activityId });
  if (player) {
    throw new Error("Player already exists for matching user and activity");
  }

  const user = await userModel.findOne({ _id: userId });
  if (!user) {
    throw new Error("User not found");
  }

  const activity = await activityModel.findOne({ _id: activityId });
  if (!activity) {
    throw new Error("Activity not found");
  }

  const newPlayer = await playerModel.create({
    userId: user._id,
    userName: user.name,
    activityId: activity._id,
    activityName: activity.name,
    rating: DEFAULT_RATING,
    ratingHistory: [{ date: new Date(), rating: DEFAULT_RATING }],
    games: 0,
  });

  return newPlayer;
};
