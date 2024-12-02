"use client";

import { EightBallIconFull } from "@/app/components/ui/icons/8BallIconFull";
import Modal from "@/app/components/ui/modal";
import { PlayerMongo } from "@/modules/player/types";
import dynamic from "next/dynamic";
import { QueueIcon } from "../ui/icons/QueueIcon";
import LastGameStats from "./lastGameStats";
import { getNameWithTrophies } from "./player";

export const getTrophyIcon = (ranking: number, key: number) => {
    console.log("RANKGing: ", ranking)
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

const getAvatarContent = (ranking: number) => {
    const texts = ["1st", "2nd", "3rd"];

    return texts[ranking - 1] || ""
}

export default function Avatar({
    player,
    ranking
}: {
    player: PlayerMongo;
    ranking: number;
}) {
    const icon = getRankingIcon(ranking);
    const { name, trophies } = player;

    return (
        <div className="flex flex-col text-center items-center gap-6" style={{ marginTop: ranking === 1 ? 0 : 20 }}>
            <div className="flex flex-col text-center items-center gap-2">
                <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content w-20 rounded-xl">
                        <span className="text-2xl">{getAvatarContent(ranking)}</span>
                    </div>
                </div>
                <span className="text-xl">{name}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                {icon}
                <div className="flex gap-2 items-center">
                    <span>{player.rating}</span>
                    <LastGameStats ratingHistory={player.ratingHistory} />
                </div>
            </div>
            {/* {
                !!trophies?.length &&
                <div className="flex w-full flex-col text-center">
                    <span>Prize:</span>
                    {trophies.map((trophy, index) => getTrophyIcon(trophy.ranking, index))}
                </div>
            } */}
        </div>
    );
}
