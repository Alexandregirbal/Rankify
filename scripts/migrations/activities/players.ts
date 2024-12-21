import { ZodObjectId } from "@/database/utils";
import { playerModel } from "@/modules/player/model";
import { findOrCreateUser } from "@/modules/user/create";
import { Trophy } from "@/modules/user/types";
import { ObjectId } from "mongodb";

type MigrationReport = {
  playersToUpdate: string[];
  updatedPlayers: string[];
  matchingLengths: boolean;
};

export const migrateToNewPlayerSchema = async ({
  activityId,
  activityName,
  applyUpdates = false,
}: {
  activityId: ZodObjectId;
  activityName: string;
  applyUpdates?: boolean;
}): Promise<MigrationReport> => {
  const allPlayers = await playerModel.find().lean();
  const report: MigrationReport = {
    playersToUpdate: [] as string[],
    updatedPlayers: [] as string[],
    matchingLengths: false,
  };

  for (const player of allPlayers) {
    const playerName = player.name ?? player.userName;
    if (!playerName) {
      console.error("Player has no name", player);
      continue;
    }
    report.playersToUpdate.push(playerName);
    console.log("Migrating player...", playerName);

    const playerTrophies: Trophy[] | undefined = player.trophies?.map(
      (trophy) => ({
        activityId,
        activityName,
        ranking: trophy.ranking,
        rating: trophy.rating,
        season: trophy.season,
      })
    );

    const newPlayer = await findOrCreateUser({
      name: playerName,
      trophies: playerTrophies,
    });
    if (!newPlayer) {
      console.error("Could not find or create user for player", playerName);
      continue;
    }

    if (applyUpdates) {
      await playerModel.updateOne({ _id: player._id }, [
        {
          $set: {
            userId: new ObjectId(newPlayer._id),
            userName: newPlayer.name,
            activityId: activityId,
            activityName: activityName,
          },
        },
        {
          $unset: ["name"],
        },
      ]);
      console.log("Player migrated:", playerName);
      report.updatedPlayers.push(playerName);
    }
  }

  if (report.playersToUpdate.length == report.updatedPlayers.length) {
    report.matchingLengths = true;
  }

  return report;
};
