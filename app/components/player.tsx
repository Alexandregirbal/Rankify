"use client";

import { Player } from "@/modules/player/types";
import dynamic from "next/dynamic";
import LastGameStats from "./lastGameStats";
import { EightBallIconFull } from "./ui/8BallIconFull";
import Modal from "./ui/modal";

const HistoryComponent = dynamic(() => import("./history"));

const getRankingIcon = (ranking: number) => {
  switch (ranking) {
    case 1:
      return <EightBallIconFull className="fill-gold" />;
    case 2:
      return <EightBallIconFull className="fill-silver" />;
    case 3:
      return <EightBallIconFull className="fill-bronze" />;
    default:
      return <></>;
  }
};

export default function PlayerComponent({
  player,
  ranking,
}: {
  player: Player;
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
            {getRankingIcon(ranking)} {player.name}
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
