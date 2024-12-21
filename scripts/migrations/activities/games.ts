import { ZodObjectId } from "@/database/utils";
import { gameModel } from "@/modules/game/model";

type MigrationReport = {
  gamesToUpdate: number;
  updatedGames: number;
  matchingLengths: boolean;
};

export const migrateToNewGameSchema = async ({
  activityId,
  activityName,
  applyUpdates = false,
}: {
  activityId: ZodObjectId;
  activityName: string;
  applyUpdates?: boolean;
}): Promise<MigrationReport> => {
  const allGames = await gameModel.find().sort({ _id: 1 }).lean();
  const report: MigrationReport = {
    gamesToUpdate: 0,
    updatedGames: 0,
    matchingLengths: false,
  };

  for (const game of allGames) {
    report.gamesToUpdate += 1;
    console.log("Migrating game...", game._id.toString());

    if (applyUpdates) {
      await gameModel.updateOne({ _id: game._id }, [
        {
          $set: {
            activityId: activityId,
            activityName: activityName,
          },
        },
      ]);
      console.log("Game migrated:", game._id.toString());
      report.updatedGames += 1;
    }
  }

  if (report.gamesToUpdate == report.updatedGames) {
    report.matchingLengths = true;
  }

  return report;
};
