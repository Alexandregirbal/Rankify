"use client";

import { Player } from "@/modules/elo/types";
import { Game } from "@/modules/game/types";
import { useEffect, useState } from "react";

const GameHistory = ({ game, player }: { game: Game; player: Player }) => {
  const isInTeam1 = game.team1
    .map((player) => player.name)
    .includes(player.name);
  const isWinner = game.winner === (isInTeam1 ? "1" : "2");

  return (
    <div className="h-14 flex gap-2 items-center justify-center text-center bg-neutral rounded-lg">
      <div
        className={`w-2 h-full rounded-l-lg ${
          isWinner ? "bg-green-400" : "bg-red-500"
        }`}
      ></div>
      <div
        className={`w-5/12 h-full flex flex-col justify-center gap-1 ${
          isInTeam1 ? "font-bold" : ""
        }`}
      >
        <div className="text-nowrap overflow-x-scroll">
          {game.team1.map((player) => player.name).join(" & ")}
        </div>
        <div>{game.scores[0]}</div>
      </div>
      <div className="w-1/12 text-center">vs</div>
      <div
        className={`w-5/12 h-full flex flex-col justify-center gap-1 ${
          isInTeam1 ? "" : "font-bold"
        }`}
      >
        <div className="text-nowrap overflow-x-scroll">
          {game.team2.map((player) => player.name).join(" & ")}
        </div>
        <div className={isInTeam1 ? "" : "bold"}>{game.scores[1]}</div>
      </div>
    </div>
  );
};

const GamesSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 items-center">
      {new Array(5).fill(null).map((_, i) => (
        <div key={i} className="skeleton w-full h-14"></div>
      ))}
    </div>
  );
};

const HistoryComponent = ({ player }: { player: Player }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/game?playerName=${player.name}`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setGames(data.games);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [player.name]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl">{player.name}</h1>
      {isLoading && <GamesSkeleton />}
      {games.toReversed().map((game, index) => (
        <GameHistory key={index} game={game} player={player} />
      ))}
    </div>
  );
};

export default HistoryComponent;
