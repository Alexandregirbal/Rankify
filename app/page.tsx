import { getAllPlayers } from "@/modules/player/get";
import PlayerComponent from "./components/player";

export default async function Leaderboard() {
  const allPlayers = await getAllPlayers();

  return (
    <div className="h-full flex flex-col items-center gap-4 p-4 overflow-y-scroll">
      <h1 className="text-center text-2xl">Leaderboard</h1>
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
