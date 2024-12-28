"use client";

import { PlayerMongo } from "@/modules/player/types";
import Link from "next/link";
import { QueueIcon } from "../ui/icons/QueueIcon";
import { TrophyIcon } from "../ui/icons/TrophyIcon";
import LastGameStats from "./lastGameStats";

export const getTrophyIcon = (ranking: number, key: number) => {
  switch (ranking) {
    case 1:
      return <QueueIcon key={key} className="fill-gold -mr-4" />;
    case 2:
      return <QueueIcon key={key} className="fill-silver -mr-4" />;
    case 3:
      return <QueueIcon key={key} className="fill-bronze -mr-4" />;
    default:
      return <></>;
  }
};

export const getNameWithTrophies = (player: PlayerMongo) => {
  const { userName, trophies } = player;
  if (!trophies) return <div>{userName}</div>;

  return (
    <div className="flex">
      {userName}{" "}
      {trophies.map((trophy, index) => getTrophyIcon(trophy.ranking, index))}
    </div>
  );
};

export default function PlayerComponent({
  player,
  ranking,
}: {
  player: PlayerMongo;
  ranking: number;
}) {
  return (
    <Link
      className="flex rounded-xl items-center gap-2 border bg-neutral border-base-300 py-2 px-4 h-12 w-full"
      href={`/playerHistory/${player._id}`}
    >
      <div className="flex flex-row items-center w-full justify-between">
        <div className="flex flex-row items-center w-3/5">
          <div className="flex flex-row items-center text-center w-3/12 gap-1">
            <TrophyIcon />
            <span>{ranking}</span>
          </div>
          <div className="flex flex-row items-centertext-center">
            {getNameWithTrophies(player)}
          </div>
        </div>
        <div className="flex flex-row items-center text-center w-2/5 justify-between">
          <span>{player.rating}</span>
          <LastGameStats ratingHistory={player.ratingHistory} />
        </div>
      </div>
    </Link>
  );
}
