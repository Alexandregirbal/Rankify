"use client";

import HistoryComponent from "@/app/components/player/history";
import { PlayerMongo } from "@/modules/player/types";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlayerDetail() {
    const { id } = useParams();
    const [player, setPlayer] = useState<PlayerMongo | null>(null);
    const router = useRouter();

    const initPlayer = async () => {
        const playerId = Array.isArray(id) ? id[0] : id;

        try {
            const data = await fetch(`/api/players/id=${playerId}`, { method: "GET" }).then((res) => res.json());
            setPlayer(data);
        } catch (error) {

        }
    }

    useEffect(() => {
        initPlayer()
    }, []);

    return (
        <div className="h-full w-full bg-gray-950 flex flex-col gap-6 py-4 px-6" data-theme="mytheme">
            {
                player ?
                    <>
                        <div className="w-full flex flex-row justify-center items-center relative">
                            <span className="text-2xl">{player.name}</span>
                            <div className="absolute left-0 cursor-pointer" onClick={() => router.back()}>
                                <ArrowLeft />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-scroll">
                            <HistoryComponent player={player} />
                        </div>
                    </>
                    :
                    <div className="h-full w-full flex justify-center items-center">
                        <span className="loading loading-spinner text-accent"></span>
                    </div>
            }
        </div>
    )
}