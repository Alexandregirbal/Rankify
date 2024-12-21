import mongooseConnect from "@/database/config/mongoose";
import { ZodObjectId } from "@/database/utils";
import { seasonModel } from "./model";
import { SeasonMongo } from "./types";

export const getCurrentSeason = async (
  activityId: ZodObjectId
): Promise<SeasonMongo | null> => {
  await mongooseConnect();

  const seasons = await seasonModel
    .find({ activityId, state: "active" })
    .lean();
  if (seasons.length > 1) return null;

  return seasons[0];
};
