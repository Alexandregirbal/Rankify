"use client";

import { EightBallIconFull } from "@/app/components/ui/icons/8BallIconFull";
import Modal from "@/app/components/ui/modal";
import Link from "next/link";
import { PlayerMongo } from "@/modules/player/types";
import dynamic from "next/dynamic";
import { QueueIcon } from "../ui/icons/QueueIcon";
import LastGameStats from "./lastGameStats";
import { TrophyIcon } from "../ui/icons/TrophyIcon";

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
  const { name, trophies } = player;
  if (!trophies) return <div>{name}</div>;

  return (
    <div className="flex">
      {name}{" "}
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
      href={`/playerdetail/${player._id}`}
    >
      <div className="flex flex-row items-center w-full justify-between">
        <div className="flex flex-row items-center w-3/5">
          <div className="flex flex-row items-center text-center w-3/12 gap-1">
            <TrophyIcon />
            <span>{ranking}</span>
          </div>
          <div className="flex flex-row items-centertext-center">
            {player.name}
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
