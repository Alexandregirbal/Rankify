import mongooseConnect from "@/database/config/mongoose";
import { DEFAULT_RATING } from "@/modules/elo/constants";
import { activityModel } from "../activity/model";
import { ActivityMongo } from "../activity/types";
import { findOrCreateUser } from "../user/create";
import { UserMongo } from "../user/types";
import { playerModel } from "./model";
import { PlayerMongo } from "./types";

export const createPlayer = async ({
  userName,
  activityId,
}: {
  userName: UserMongo["name"];
  activityId: ActivityMongo["_id"];
}): Promise<PlayerMongo> => {
  await mongooseConnect();

  const user = await findOrCreateUser({ name: userName });
  if (!user) {
    throw new Error("User could not be found nor created");
  }

  const player = await playerModel.findOne({ userId: user._id, activityId });
  if (player) {
    throw new Error("Player already exists for matching user and activity");
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
