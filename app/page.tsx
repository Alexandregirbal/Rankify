import AddPlayer from "@/app/components/player/addPlayer";
import PlayerComponent from "@/app/components/player/player";
import { getAllPlayers } from "@/modules/player/get";
import { getOrCreateQuoteOfTheDay } from "@/modules/quote/get";

export default async function Leaderboard() {
  const allPlayers = await getAllPlayers();
  const quoteOfTheDay = await getOrCreateQuoteOfTheDay();

  return (
    <div className="h-full flex flex-col items-center gap-4 p-4 overflow-y-scroll">
      <h1 className="text-center text-2xl">Leaderboard</h1>
      <p className="text-center">{quoteOfTheDay.quote}</p>
      {allPlayers.map((player, index) => (
        <PlayerComponent
          key={player.name}
          player={player}
          ranking={index + 1}
        />
      ))}
      <AddPlayer />
    </div>
  );
}
