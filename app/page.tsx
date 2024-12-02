"use server";

import AddPlayer from "@/app/components/player/addPlayer";
import PlayerComponent from "@/app/components/player/player";
import { getEnvConfigs } from "@/envConfig";
import { getAllPlayers } from "@/modules/player/get";
import { getOrCreateQuoteOfTheDay } from "@/modules/quote/get";
import Avatar from "./components/player/avatar";
import { PlayerMongo } from "@/modules/player/types";

export default async function Leaderboard() {
  const allPlayers = (await getAllPlayers(getEnvConfigs().GAMES_TO_BE_RANKABLE));
  const otherPlayers = allPlayers.slice(3, allPlayers.length);
  const quoteOfTheDay = await getOrCreateQuoteOfTheDay();

  const getFirstThree = () => ([
    allPlayers[1] ? { ...allPlayers[1], ranking: 2 } : null,
    allPlayers[0] ? { ...allPlayers[0], ranking: 1 } : null,
    allPlayers[2] ? { ...allPlayers[2], ranking: 3 } : null,
  ])

  return (
    <div className="h-full w-full gap-10 bg-gray-950 flex flex-col overflow-y-scroll py-4" data-theme="mytheme">
      <div>
        <h1 className="text-center text-2xl">Leaderboard</h1>
        <p className="text-center">{quoteOfTheDay}</p>
      </div>
      <div className="flex flex-row mx-12 mt-14 justify-between">
        {getFirstThree().map((el, key) => {
          if (!el) return <span key={key}>a</span>

          const { ranking, ...player } = el;
          return <Avatar key={player.name} player={player} ranking={ranking} />
        })}
      </div>

      <div className="flex flex-1 flex-col mx-12 gap-2 overflow-y-scroll">
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
        <div className="flex flex-1 flex-col items-center gap-2 w-full overflow-y-scroll">
          {otherPlayers.map((player, index) => (
            <PlayerComponent
              key={player.name}
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
