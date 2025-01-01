import { HEADER_VARIABLES } from "@/app/constants";
import { getEnvConfigs } from "@/envConfig";
import { getActivityName } from "@/modules/activity/get";
import { getAllPlayersOfActivity } from "@/modules/player/get";
import { addPlayerTrophy, resetPlayersRating } from "@/modules/player/update";
import { startNewSeason } from "@/modules/season/create";
import { Leaderboard } from "@/modules/season/types";
import { endActiveSeason } from "@/modules/season/update";
import { addUserTrophy } from "@/modules/user/update";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const postSeasonBodySchema = z.object({
  updateType: z.literal("end_season"),
});

export async function POST(request: Request) {
  const token = request.headers.get(HEADER_VARIABLES.adminToken);
  const activityId = request.headers.get(HEADER_VARIABLES.activityId);

  if (!token || token !== getEnvConfigs().ADMIN_TOKEN) {
    return Response.json({ error: "Invalid admin token" }, { status: 401 });
  }

  if (!activityId) {
    return Response.json({ error: "Activity is required" }, { status: 401 });
  }
  const activityName = await getActivityName(activityId);
  if (!activityName) {
    return Response.json(
      { error: "Activity could not be found" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const bodyResult = postSeasonBodySchema.safeParse(body);
  if (!bodyResult.success) {
    return Response.json({ error: bodyResult.error }, { status: 400 });
  }
  const { updateType } = bodyResult.data;

  const report: Record<string, any> = {};
  switch (updateType) {
    case "end_season":
      const players = await getAllPlayersOfActivity({
        activityId,
        minimumGames: getEnvConfigs().GAMES_TO_BE_RANKABLE,
      });

      const leaderboard: Leaderboard[] = players.map((player, index) => ({
        ranking: index + 1,
        playerId: player._id,
        playerName: player.userName,
        rating: player.rating,
      }));

      const endedSeason = await endActiveSeason({ activityId, leaderboard });
      if (!endedSeason)
        return Response.json({ error: "No active season" }, { status: 400 });

      const top3 = players.slice(0, 3);
      await Promise.all(
        top3.map(async (player, index) => {
          await addPlayerTrophy({
            player,
            ranking: index + 1,
            seasonNumber: endedSeason.number,
          });
          await addUserTrophy({
            userId: player.userId,
            trophy: {
              season: endedSeason.number,
              ranking: index + 1,
              rating: player.rating,
              activityId,
              activityName,
            },
          });
        })
      );
      const [_, newSeason] = await Promise.all([
        resetPlayersRating({ activityId }),
        startNewSeason({
          activityId,
          activityName,
          number: endedSeason.number + 1,
        }),
      ]);

      revalidatePath("/", "layout");
      report.endedSeason = endedSeason;
      report.newSeason = newSeason;
  }

  return Response.json({ report }, { status: 200 });
}
