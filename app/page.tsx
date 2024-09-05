import { getAllPlayers } from "@/modules/player/get";
import { getQuoteOfTheDay } from "@/modules/quoteOfTheDay/get";
import PlayerComponent from "./components/player";

export default async function Leaderboard() {
  const allPlayers = await getAllPlayers();
  const quoteOfTheDay = await getQuoteOfTheDay();

  return (
    <div className="h-full flex flex-col items-center gap-4 p-4 overflow-y-scroll">
      <h1 className="text-center text-2xl">Leaderboard</h1>
      <p className="text-center">{quoteOfTheDay}</p>
      {allPlayers.map((player, index) => (
        <PlayerComponent
          key={player.name}
          player={player}
          ranking={index + 1}
        />
      ))}
    </div>
  );
}
