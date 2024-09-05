"use client";

import { Player } from "@/modules/elo/types";
import { Crown } from "lucide-react";
import dynamic from "next/dynamic";
import LastGameStats from "./lastGameStats";
import Modal from "./ui/modal";

const HistoryComponent = dynamic(() => import("./history"));

export default function PlayerComponent({
  player,
  ranking,
}: {
  player: Player;
  ranking: number;
}) {
  return (
    <Modal
      className="flex rounded-xl items-center gap-4 border bg-neutral-content border-base-300 p-4 w-full"
      content={<HistoryComponent player={player} />}
    >
      <>
        <div className=" w-8 text-3xl text-center">{ranking}</div>
        <div className="flex justify-between grow">
          <div className="text-xl flex gap-4 items-center">
            {ranking === 1 ? <Crown /> : <></>} {player.name}
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
