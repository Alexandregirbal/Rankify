import { zodObjectId } from "@/database/utils";
import {
  getNumberOfGamesSince,
  getTotalNumberOfGames,
  getTotalNumberOfWins,
} from "@/modules/game/get";
import { getPlayerRatingHistory } from "@/modules/player/get";
import { getExtremPlayerStreak } from "@/modules/player/utils";
import { getPlayerQuoteOfTheDay } from "@/modules/quote/get";
import dayjs from "dayjs";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get("playerId") || "";

  if (!playerId) {
    return Response.json({ error: "playerId is required" }, { status: 400 });
  }

  if (zodObjectId.safeParse(playerId).success === false) {
    return Response.json(
      { error: "playerId is not a valid ObjectId" },
      { status: 400 }
    );
  }

  const [
    totalNumberOfGamesPlayed,
    numberOfGamesPlayedToday,
    totalNumberOfWins,
    playerRatingHistory,
    playerQuote,
  ] = await Promise.all([
    getTotalNumberOfGames({ playerId }),
    getNumberOfGamesSince({
      since: dayjs().startOf("day").toDate(),
      playerId,
    }),
    getTotalNumberOfWins(playerId),
    getPlayerRatingHistory(playerId),
    getPlayerQuoteOfTheDay(playerId),
  ]);

  return Response.json({
    totalNumberOfGamesPlayed,
    numberOfGamesPlayedToday,
    winLossRatio: +(totalNumberOfWins / totalNumberOfGamesPlayed).toFixed(2),
    extremeStreaks: getExtremPlayerStreak({
      ratingHistory: playerRatingHistory,
    }),
    playerQuote,
  });
}
