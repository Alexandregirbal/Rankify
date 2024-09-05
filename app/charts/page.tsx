"use server";

import {
  getNumberOfGamesSince,
  getTotalNumberOfGames,
} from "@/modules/game/get";
import { getAllPlayersRatingHistories } from "@/modules/player/get";
import dayjs from "dayjs";
import RatingHistories from "./ratingHistories";

export default async function Charts() {
  const allPlayers = await getAllPlayersRatingHistories();
  const totalNumberOfGamesPlayed = await getTotalNumberOfGames({});
  const numberOfGamesPlayedToday = await getNumberOfGamesSince({
    since: dayjs().startOf("day").toDate(),
  });

  return (
    <div className="h-full flex flex-col items-center gap-2 p-4 overflow-y-scroll">
      <h1 className="text-center text-2xl">Stats of the season</h1>
      <p className="w-full">
        Number of games played: {totalNumberOfGamesPlayed}
      </p>
      <p className="w-full">
        Number of games played today: {numberOfGamesPlayedToday}
      </p>
      <div className="grow w-full flex flex-col gap-4 items-center">
        <RatingHistories players={allPlayers} />
      </div>
    </div>
  );
}
