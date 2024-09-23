import mongooseConnect from "@/database/config/mongoose";
import { seasonModel } from "./model";
import { SeasonMongo } from "./types";

export const getCurrentSeason = async (): Promise<SeasonMongo | null> => {
  await mongooseConnect();

  const seasons = await seasonModel.find({ state: "active" }).lean();
  if (seasons.length > 1) return null;

  return seasons[0];
};
