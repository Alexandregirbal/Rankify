import mongooseConnect from "@/database/config/mongoose";
import { activityModel } from "./model";
import { ActivityMongo } from "./types";

export const getAllActivities = async (): Promise<Array<ActivityMongo>> => {
  await mongooseConnect();
  const activities = await activityModel.find().exec();
  if (!activities) return [];

  return activities.map((activity) => activity.toObject());
};
