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
    <div className="h-full flex flex-col items-center gap-2 p-4 overflow-y-scroll text-lg">
      <h1 className="text-center text-2xl">Statisticts</h1>
      <ul className="w-full">
        <li>
          <span>Games played:</span>{" "}
          <span className="font-bold">{totalNumberOfGamesPlayed}</span>
        </li>
        <li>
          <span>Games played today:</span>{" "}
          <span className="font-bold">{numberOfGamesPlayedToday}</span>
        </li>
      </ul>
      <div className="grow w-full flex flex-col gap-4 items-center">
        <RatingHistories players={allPlayers} />
      </div>
    </div>
  );
}
