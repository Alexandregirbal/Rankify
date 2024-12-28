"use server";

import AddPlayer from "@/app/components/player/addPlayer";
import PlayerComponent from "@/app/components/player/player";
import { getEnvConfigs } from "@/envConfig";
import { getActivityId } from "@/modules/activity/get";
import { getAllPlayersOfActivity } from "@/modules/player/get";
import { getOrCreateQuoteOfTheDay } from "@/modules/quote/get";
import { getCurrentSeason } from "@/modules/season/get";
import PodiumPlayer from "../components/player/podiumPlayer";
import { ActivityNameParams } from "./types";

export default async function Leaderboard({ params }: ActivityNameParams) {
  const { activityName } = await params;

  const activityId = await getActivityId(activityName);
  if (!activityId) return <div>Activity not found</div>;

  const currentSeason = await getCurrentSeason(activityId);

  const allPlayers = await getAllPlayersOfActivity({
    activityId,
    minimumGames: getEnvConfigs().GAMES_TO_BE_RANKABLE,
  });
  const otherPlayers = allPlayers.slice(3, allPlayers.length);
  const quoteOfTheDay = await getOrCreateQuoteOfTheDay();

  const getFirstThree = () => [
    allPlayers[1] ? { ...allPlayers[1], ranking: 2 } : null,
    allPlayers[0] ? { ...allPlayers[0], ranking: 1 } : null,
    allPlayers[2] ? { ...allPlayers[2], ranking: 3 } : null,
  ];

  return (
    <div className="h-full w-full gap-6 background flex flex-col overflow-y-scroll">
      <div>
        <h1 className="text-center text-2xl">{`Classement ${activityName}`}</h1>
        <h2 className="text-center text-lg">{`Saison ${
          currentSeason?.number ?? 1
        }`}</h2>
        <p className="text-center text-sm">{quoteOfTheDay}</p>
      </div>
      <div className="flex flex-row justify-evenly">
        {getFirstThree().map((el, key) => {
          if (!el) return <></>;

          const { ranking, ...player } = el;
          return (
            <PodiumPlayer
              key={player.userName}
              player={player}
              ranking={ranking}
            />
          );
        })}
      </div>

      <div className="flex flex-1 flex-col px-4 gap-2 overflow-y-scroll">
        <div className="flex flex-row items-center w-full justify-between px-4">
          <div className="flex flex-row items-center w-3/5">
            <div className="flex flex-row items-center text-center w-3/12">
              <span className="text-primary">Rank</span>
            </div>
            <div className="flex flex-row items-center text-center ">
              <span className="text-primary">Player</span>
            </div>
          </div>
          <div className="flex flex-row items-center text-center w-2/5 justify-between">
            <span className="text-primary">Rating</span>
            <span className="text-primary">Streak</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col px-2 items-center gap-2 w-full overflow-y-scroll">
          {otherPlayers.map((player, index) => (
            <PlayerComponent
              key={player.userName}
              player={player}
              ranking={index + 4}
            />
          ))}
          <AddPlayer />
        </div>
      </div>
    </div>
  );
}
