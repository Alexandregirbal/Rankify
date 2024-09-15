import {
  getNumberOfGamesSince,
  getTotalNumberOfGames,
  getTotalNumberOfWins,
} from "@/modules/game/get";
import { getPlayerRatingHistory } from "@/modules/player/get";
import { getExtremPlayerStreak } from "@/modules/player/utils";
import { getOrCreatePlayerQuoteOfTheDay } from "@/modules/quote/get";
import dayjs from "dayjs";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const playerName = searchParams.get("playerName") || "";

  if (!playerName) {
    return Response.json({ error: "playerName is required" }, { status: 400 });
  }

  const [
    totalNumberOfGamesPlayed,
    numberOfGamesPlayedToday,
    totalNumberOfWins,
    playerRatingHistory,
    playerQuote,
  ] = await Promise.all([
    getTotalNumberOfGames({ playerName }),
    getNumberOfGamesSince({
      since: dayjs().startOf("day").toDate(),
      playerName,
    }),
    getTotalNumberOfWins(playerName),
    getPlayerRatingHistory(playerName),
    getOrCreatePlayerQuoteOfTheDay(playerName),
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
