import mongooseConnect from "@/database/config/mongoose";
import { seasonModel } from "./model";
import { Leaderboard } from "./types";

export const endActiveSeason = async ({
  leaderboard,
  activityId,
  activityName,
}: {
  leaderboard: Leaderboard[];
  activityId: string;
  activityName: string;
}) => {
  await mongooseConnect();

  const updateResult = await seasonModel.findOneAndUpdate(
    { state: "active", activityId },
    { $set: { state: "ended", leaderboard, activityName } },
    { upsert: true, new: true }
  );

  return updateResult;
};
