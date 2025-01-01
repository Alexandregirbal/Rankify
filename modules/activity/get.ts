import mongooseConnect from "@/database/config/mongoose";
import { activityModel } from "./model";
import { ActivityMongo } from "./types";

export const getAllActivities = async (): Promise<Array<ActivityMongo>> => {
  await mongooseConnect();
  const activities = await activityModel.find().exec();
  if (!activities) return [];

  return activities.map((activity) => activity.toObject());
};

export const getActivityId = async (activityName: string) => {
  await mongooseConnect();
  const activity = await activityModel.findOne({ name: activityName }).exec();
  if (!activity) return null;

  return activity._id.toString();
};

export const getActivityName = async (activityId: string) => {
  await mongooseConnect();
  const activity = await activityModel.findOne({ _id: activityId }).exec();
  if (!activity) return null;

  return activity.name;
};
