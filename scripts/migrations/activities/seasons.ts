import { ZodObjectId } from "@/database/utils";
import { seasonModel } from "@/modules/season/model";

type MigrationReport = {
  seasonsToUpdate: number;
  updatedSeasons: number;
  matchingLengths: boolean;
};

export const migrateToNewSeasonSchema = async ({
  activityId,
  activityName,
  applyUpdates = false,
}: {
  activityId: ZodObjectId;
  activityName: string;
  applyUpdates?: boolean;
}): Promise<MigrationReport> => {
  const allSeasons = await seasonModel.find().sort({ _id: 1 }).lean();
  const report: MigrationReport = {
    seasonsToUpdate: 0,
    updatedSeasons: 0,
    matchingLengths: false,
  };

  for (const season of allSeasons) {
    report.seasonsToUpdate += 1;
    console.log("Migrating season...", season.number);

    if (applyUpdates) {
      await seasonModel.updateOne({ _id: season._id }, [
        {
          $set: {
            activityId: activityId,
            activityName: activityName,
          },
        },
      ]);
      console.log("Season migrated:", season.number);
      report.updatedSeasons += 1;
    }
  }

  if (report.seasonsToUpdate == report.updatedSeasons) {
    report.matchingLengths = true;
  }

  return report;
};
