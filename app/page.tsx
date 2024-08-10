"use client";

import { useEffect, useState } from "react";
import PlayerComponent from "./components/player";
import { Player } from "./modules/elo/types";

export default function Leaderboard() {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);

  useEffect(() => {
    fetch("/api/players")
      .then((res) => res.json())
      .then((data) => {
        setAllPlayers(data.players);
      });
  }, []);

  return (
    <div className="h-full flex flex-col items-center gap-4 p-4 overflow-y-scroll">
      <h1 className="text-center text-2xl">Leaderboard</h1>
      {allPlayers.map((player, index) => (
        <PlayerComponent
          key={player.name}
          name={player.name}
          rating={player.rating}
          ranking={index + 1}
        />
      ))}
    </div>
  );
}
