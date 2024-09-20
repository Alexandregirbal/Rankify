"use client";

import { GameMongo, GamePlayer } from "@/modules/game/types";
import { PlayerMongo } from "@/modules/player/types";
import { displayNumberWithSign } from "@/modules/player/utils";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const GameHistoryPart = ({
  players,
  isOwnedTeam,
}: {
  players: Array<GamePlayer>;
  isOwnedTeam: boolean;
}) => {
  return (
    <div
      className={`grow h-full flex flex-col justify-center items-center gap-1 ${
        isOwnedTeam ? "font-bold" : ""
      }`}
    >
      <div className=" overflow-y-auto w-24">
        {players.map((player) => player.name).join(", ")}
      </div>
    </div>
  );
};

const GameHistory = ({
  game,
  player,
}: {
  game: GameMongo;
  player: PlayerMongo;
}) => {
  const isInTeam1 = game.team1
    .map((player) => player.name)
    .includes(player.name);
  const isWinner = game.winner === (isInTeam1 ? "1" : "2");
  const gamePlayer = (isInTeam1 ? game.team1 : game.team2).find(
    (gp) => gp.playerId === player._id
  );
  const pointsReward = gamePlayer?.newRating
    ? gamePlayer.newRating - gamePlayer.rating
    : null;

  return (
    <div className="h-14 flex gap-2 items-center justify-stretch text-center bg-neutral-content rounded-lg">
      <div className="h-full flex items-center gap-1">
        <div
          className={`w-3 h-full rounded-l-lg ${
            isWinner ? "bg-green-400" : "bg-red-500"
          }`}
        ></div>
        {pointsReward ? (
          <p className="text-sm">{displayNumberWithSign(pointsReward)}</p>
        ) : (
          <></>
        )}
      </div>
      <div className="h-full grow flex justify-center items-center gap-1">
        <GameHistoryPart players={game.team1} isOwnedTeam={isInTeam1} />
        <div className="w-16 text-center">
          <p>{`${game.scores[0]} - ${game.scores[1]}`}</p>
          <p className="text-xs">{dayjs(game.createdAt).format("DD MMM")}</p>
        </div>
        <GameHistoryPart players={game.team2} isOwnedTeam={!isInTeam1} />
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

const HistoryComponent = ({ player }: { player: PlayerMongo }) => {
  const [games, setGames] = useState<GameMongo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/game?playerId=${player._id}`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setGames(data.games);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [player._id]);

  return (
    <div className="flex flex-col gap-4 px-2">
      {isLoading && <GamesSkeleton />}
      {games.map((game, index) => (
        <GameHistory key={index} game={game} player={player} />
      ))}
    </div>
  );
};

export default HistoryComponent;
