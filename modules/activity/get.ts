import mongooseConnect from "@/database/config/mongoose";
import { activityModel } from "./model";
import { ActivityMongo } from "./types";

export const getAllActivities = async (): Promise<Array<ActivityMongo>> => {
  await mongooseConnect();
  return activityModel.find().lean();
};
