import { HEADER_VARIABLES } from "@/app/constants";
import { zodObjectId } from "@/database/utils";
import {
  getMostFrequentTeammate,
  getMostLossesAgainst,
  getMostWinsAgainst,
  getNumberOfGamesSince,
  getTotalNumberOfGames,
  getTotalNumberOfWins,
} from "@/modules/game/get";
import { getPlayer } from "@/modules/player/get";
import { getExtremPlayerStreak } from "@/modules/player/utils";
import { getPlayerQuoteOfTheDay } from "@/modules/quote/get";
import dayjs from "dayjs";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get("playerId");

  if (!playerId) {
    return Response.json({ error: "playerId is required" }, { status: 400 });
  }

  if (zodObjectId.safeParse(playerId).success === false) {
    return Response.json(
      { error: "playerId is not a valid ObjectId" },
      { status: 400 }
    );
  }

  const activityId = request.headers.get(HEADER_VARIABLES.activityId);
  if (!activityId) {
    return Response.json({ error: "Activity is required" }, { status: 401 });
  }

  const player = await getPlayer({ playerId });
  if (!player) {
    return Response.json({ error: "player not found" }, { status: 404 });
  }

  const [
    totalNumberOfGamesPlayed,
    numberOfGamesPlayedToday,
    totalNumberOfWins,
    playerQuote,
    mostLossesAgainst,
    mostWinsAgainst,
    mostFrequentTeammate,
  ] = await Promise.all([
    getTotalNumberOfGames({ activityId, playerId }),
    getNumberOfGamesSince({
      activityId,
      since: dayjs().startOf("day").toDate(),
      playerId,
    }),
    getTotalNumberOfWins(playerId),
    getPlayerQuoteOfTheDay(playerId),
    getMostLossesAgainst(playerId),
    getMostWinsAgainst(playerId),
    getMostFrequentTeammate(playerId),
  ]);

  return Response.json({
    totalNumberOfGamesPlayed,
    numberOfGamesPlayedToday,
    winLossRatio: +(totalNumberOfWins / totalNumberOfGamesPlayed).toFixed(2),
    extremeStreaks: getExtremPlayerStreak({
      ratingHistory: player.ratingHistory,
    }),
    playerQuote,
    mostLossesAgainst,
    mostWinsAgainst,
    mostFrequentTeammate,
  });
}
