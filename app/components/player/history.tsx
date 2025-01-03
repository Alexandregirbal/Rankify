"use client";

import { HEADER_VARIABLES } from "@/app/constants";
import { GameMongo, GamePlayer } from "@/modules/game/types";
import { PlayerMongo } from "@/modules/player/types";
import { displayNumberWithSign } from "@/modules/player/utils";
import { useActivityStore } from "@/stores/activity/provider";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const GameHistoryPart = ({
  players,
  isLeft,
}: {
  players: Array<GamePlayer>;
  isLeft: boolean;
}) => {
  return (
    <div
      className={`h-full flex-1 flex flex-col justify-center ${
        isLeft ? "items-start" : "items-end"
      } gap-y-0.5`}
    >
      {players.map(({ name, userName }, key) => (
        <span key={key}>{userName ?? name}</span>
      ))}
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
    .map((player) => player.userName ?? player.name)
    .includes(player.userName);
    
  const isWinner = game.winner === (isInTeam1 ? "1" : "2");
  const gamePlayer = (isInTeam1 ? game.team1 : game.team2).find(
    (gp) => gp.playerId === player._id
  );
  const pointsReward = gamePlayer?.newRating
    ? gamePlayer.newRating - gamePlayer.rating
    : null;

  return (
    <div className="relative flex flex-row rounded-xl justify-around items-center gap-2 border bg-neutral border-base-300 py-2 px-8 w-full">
      <GameHistoryPart players={game.team1} isLeft={true} />
      <div className="text-center flex-col items-center justify-center">
        <p
          className={`font-bold text-xl ${
            isWinner ? "text-success" : "text-error"
          }`}
        >{`${game.scores[0]} - ${game.scores[1]}`}</p>
        <p className="text-xs">{dayjs(game.createdAt).format("DD MMM")}</p>
      </div>
      <GameHistoryPart players={game.team2} isLeft={false} />
      {!!pointsReward && (
        <p className={`absolute top-1 right-2 text-sm text-primary`}>
          {displayNumberWithSign(pointsReward)}
        </p>
      )}
    </div>
  );
};

const GamesSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 items-center">
      {new Array(5).fill(null).map((_, i) => (
        <div key={i} className="skeleton w-full h-16"></div>
      ))}
    </div>
  );
};

const HistoryComponent = ({ player }: { player: PlayerMongo }) => {
  const { selectedActivity } = useActivityStore((state) => state);

  const [games, setGames] = useState<GameMongo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/game?playerId=${player._id}`, {
      method: "GET",
      headers: {
        [HEADER_VARIABLES.activityId]: selectedActivity?._id.toString() ?? "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGames(data.games);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [player._id, selectedActivity?._id]);

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
