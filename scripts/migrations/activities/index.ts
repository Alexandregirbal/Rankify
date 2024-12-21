import mongooseConnect from "@/database/config/mongoose";
import { activityModel } from "@/modules/activity/model";
import { runScript } from "../../runScript";
import { migrateToNewGameSchema } from "./games";
import { migrateToNewPlayerSchema } from "./players";

const APPLY_UPDATES = true;

runScript(async () => {
  await mongooseConnect();
  console.log("Migrating into new activities...");
  const poolActivity = await activityModel.findOne({ name: "8-Ball" });
  console.log("Seting up all players with 8-pool");
  if (!poolActivity) {
    console.error("No pool activity in database.");
    return;
  }

  const activityId = poolActivity._id;
  const activityName = poolActivity.name;

  const reports = [];

  const playerMigrationReport = await migrateToNewPlayerSchema({
    activityId,
    activityName,
    applyUpdates: APPLY_UPDATES,
  });
  reports.push({
    migration: "migrateToNewPlayerSchema",
    data: playerMigrationReport,
  });

  const gameMigrationReport = await migrateToNewGameSchema({
    activityId,
    activityName,
    applyUpdates: APPLY_UPDATES,
  });
  reports.push({
    migration: "migrateToNewGameSchema",
    data: gameMigrationReport,
  });

  return reports;
});
