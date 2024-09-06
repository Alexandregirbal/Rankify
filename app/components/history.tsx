"use client";

import { Player } from "@/modules/elo/types";
import { Game } from "@/modules/game/types";
import { useEffect, useState } from "react";

const GameHistoryPart = ({
  players,
  score,
  isOwnedTeam,
}: {
  players: Array<Player>;
  score: number;
  isOwnedTeam: boolean;
}) => {
  return (
    <div
      className={`w-5/12 h-full flex flex-col justify-center gap-1 ${
        isOwnedTeam ? "font-bold" : ""
      }`}
    >
      <div className="text-nowrap overflow-y-hidden ">
        {players.map((player) => player.name).join(" & ")}
      </div>
      <div>{score}</div>
    </div>
  );
};

const GameHistory = ({ game, player }: { game: Game; player: Player }) => {
  const isInTeam1 = game.team1
    .map((player) => player.name)
    .includes(player.name);
  const isWinner = game.winner === (isInTeam1 ? "1" : "2");

  return (
    <div className="h-14 flex gap-2 items-center justify-center text-center bg-neutral-content rounded-lg">
      <div
        className={`w-2 h-full rounded-l-lg ${
          isWinner ? "bg-green-400" : "bg-red-500"
        }`}
      ></div>
      <GameHistoryPart
        players={game.team1}
        score={game.scores[0]}
        isOwnedTeam={isInTeam1}
      />
      <div className="w-1/12 text-center">vs</div>
      <GameHistoryPart
        players={game.team2}
        score={game.scores[1]}
        isOwnedTeam={!isInTeam1}
      />
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
      {isLoading && <GamesSkeleton />}
      {games.map((game, index) => (
        <GameHistory key={index} game={game} player={player} />
      ))}
    </div>
  );
};

export default HistoryComponent;
