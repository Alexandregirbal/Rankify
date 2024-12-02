"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlayerDetail() {
    const { id } = useParams();
    const [player, setPlayer] = useState<any | null>(null);

    useEffect(() => {
        const playerId = Array.isArray(id) ? id[0] : id;

        fetch(`/api/players/id=${playerId}`, { method: "GET" })
            .then((res) => res.json())
            .then((data) => {
                setPlayer(data);
            })
    }, []);

    return <p>Post: {player?.name}</p>
}
