import { Player } from "@/modules/elo/types";
import { getAllPlayers } from "@/modules/player/get";
import PlayerComponent from "./components/player";

export default async function Leaderboard() {
  const allPlayers = await getAllPlayers();

  const handleClickOnPlayer = (player: Player) => {
    console.log("Open history", player);
  };

  return (
    <div className="h-full flex flex-col items-center gap-4 p-4 overflow-y-scroll">
      <h1 className="text-center text-2xl">Leaderboard</h1>
      {allPlayers.map((player, index) => (
        <div onClick={(player) => handleClickOnPlayer(player)}>
          <PlayerComponent
            key={player.name}
            player={player}
            ranking={index + 1}
          />
        </div>
      ))}
    </div>
  );
}
