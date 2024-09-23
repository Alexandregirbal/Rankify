"use client";

import { EightBallIconFull } from "@/app/components/ui/icons/8BallIconFull";
import Modal from "@/app/components/ui/modal";
import { PlayerMongo } from "@/modules/player/types";
import dynamic from "next/dynamic";
import { QueueIcon } from "../ui/icons/QueueIcon";
import LastGameStats from "./lastGameStats";

const HistoryComponent = dynamic(() => import("./history"));

const getTrophyIcon = (ranking: number, key: number) => {
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

const getRankingIcon = (ranking: number) => {
  switch (ranking) {
    case 1:
      return <EightBallIconFull className="fill-gold" />;
    case 2:
      return <EightBallIconFull className="fill-silver" />;
    case 3:
      return <EightBallIconFull className="fill-bronze " />;
    default:
      return <></>;
  }
};

const getNameWithTrophies = (player: PlayerMongo) => {
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
    <Modal
      className="flex rounded-xl items-center gap-1 border bg-neutral-content border-base-300 p-4 w-full"
      content={<HistoryComponent player={player} />}
      title={player.name}
    >
      <>
        <div className=" w-8 text-3xl text-center">{ranking}</div>
        <div className="flex justify-between grow">
          <div className="text-xl flex gap-2 items-center">
            {getRankingIcon(ranking)} {getNameWithTrophies(player)}
          </div>
          <div className="flex gap-2 items-center">
            <span>{player.rating}</span>
            <LastGameStats ratingHistory={player.ratingHistory} />
          </div>
        </div>
      </>
    </Modal>
  );
}
