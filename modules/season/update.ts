import mongooseConnect from "@/database/config/mongoose";
import { seasonModel } from "./model";
import { Leaderboard } from "./types";

export const endActiveSeason = async (leaderboard: Leaderboard[]) => {
  await mongooseConnect();

  const updateResult = await seasonModel.findOneAndUpdate(
    { state: "active" },
    { $set: { state: "ended", leaderboard } },
    { upsert: true, new: true }
  );
  console.log(
    `~~~~~ Girbalog | endActiveSeason | updateResult: `,
    updateResult
  );

  return updateResult;
};
