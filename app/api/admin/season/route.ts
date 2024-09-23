import { getEnvConfigs } from "@/envConfig";
import { getAllPlayers } from "@/modules/player/get";
import {
  resetPlayersRating,
  updatePlayerTrophies,
} from "@/modules/player/update";
import { startNewSeason } from "@/modules/season/create";
import { Leaderboard } from "@/modules/season/types";
import { endActiveSeason } from "@/modules/season/update";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const postSeasonBodySchema = z.object({
  updateType: z.literal("end_season"),
});

export async function POST(request: Request) {
  const token = request.headers.get("x-admin-token");
  if (token !== getEnvConfigs().ADMIN_TOKEN) {
    return Response.json({ error: "Invalid admin token" }, { status: 401 });
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
      const players = await getAllPlayers(getEnvConfigs().GAMES_TO_BE_RANKABLE);

      const leaderboard: Leaderboard[] = players.map((player, index) => ({
        ranking: index + 1,
        playerId: player._id,
        playreName: player.name,
        rating: player.rating,
      }));

      const endedSeason = await endActiveSeason(leaderboard);
      if (!endedSeason)
        return Response.json({ error: "No active season" }, { status: 400 });

      const top3 = players.slice(0, 3);
      await Promise.all(
        top3.map((player, index) =>
          updatePlayerTrophies({
            player,
            ranking: index + 1,
            seasonNumber: endedSeason.number,
          })
        )
      );
      const [_, newSeason] = await Promise.all([
        resetPlayersRating(),
        startNewSeason({
          number: endedSeason.number + 1,
        }),
      ]);

      revalidatePath("/", "layout");
      report.endedSeason = endedSeason;
      report.newSeason = newSeason;
  }

  return Response.json({ report }, { status: 200 });
}
