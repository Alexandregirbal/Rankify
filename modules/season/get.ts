import { seasonModel } from "./model";
import { SeasonMongo } from "./types";

export const getCurrentSeason = async (): Promise<SeasonMongo | null> => {
  const seasons = await seasonModel.find({ state: "active" }).lean();
  if (seasons.length > 1) return null;

  return seasons[0];
};
