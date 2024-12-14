"use server";

import { getActivityId } from "@/modules/activity/get";
import {
  getNumberOfGamesSince,
  getTotalNumberOfGames,
} from "@/modules/game/get";
import { getAllPlayersRatingHistories } from "@/modules/player/get";
import { getCurrentSeason } from "@/modules/season/get";
import dayjs from "dayjs";
import { ActivityNameParams } from "../types";
import RatingHistories from "./components/ratingHistories";

export default async function Charts({ params }: ActivityNameParams) {
  const { activityName } = await params;
  const activityId = await getActivityId(activityName);
  if (!activityId) return <div>Activity not found</div>;

  const currentSeason = await getCurrentSeason();
  const [
    allPlayers,
    totalNumberOfGamesPlayed,
    seasonNumberOfGamesPlayed,
    numberOfGamesPlayedToday,
  ] = await Promise.all([
    getAllPlayersRatingHistories({ activityId }),
    getTotalNumberOfGames({}),
    getNumberOfGamesSince({
      since: currentSeason?.startDate,
    }),
    getNumberOfGamesSince({
      since: dayjs().startOf("day").toDate(),
    }),
  ]);

  return (
    <div className="h-full flex flex-col items-center gap-6 p-4 overflow-y-scroll text-lg background">
      <h1 className="text-center text-2xl">{"Season's Stats"}</h1>
      <>
        <ul className="w-full">
          <li>
            <span>Games played total:</span>{" "}
            <span className="font-bold">
              {totalNumberOfGamesPlayed.toLocaleString()}
            </span>
          </li>
          <li>
            <span>Games played this season:</span>{" "}
            <span className="font-bold">{seasonNumberOfGamesPlayed}</span>
          </li>
          <li>
            <span>Games played today:</span>{" "}
            <span className="font-bold">{numberOfGamesPlayedToday}</span>
          </li>
        </ul>
        <div className="grow w-full flex flex-col gap-4 items-center">
          <RatingHistories players={allPlayers} />
        </div>
      </>
    </div>
  );
}
