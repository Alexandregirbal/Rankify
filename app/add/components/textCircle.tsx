"use client";

import { calculateTeamsExpectations } from "@/modules/elo/expectations";
import { estimateBaseRating } from "@/modules/elo/ratings";
import { TeamScoring } from "@/modules/elo/types";
import { PlayerMongo } from "@/modules/player/types";
import { useUIStore } from "@/stores/ui/provider";
import {
    ChangeEvent,
    FormEventHandler,
    MouseEventHandler,
    useState,
} from "react";

export default function TextCircle({ text, size }: { text: string; size: string }) {
    return (
        <div className={`w-${size} h-${size} relative rounded-full flex items-center justify-center`}>
            <div className="w-full h-full absolute rounded-full bg-accent opacity-50 flex items-center justify-center" />
            <div style={{ width: "80%", height: "80%" }} className="rounded-full bg-accent flex items-center text-center absolute justify-center">
                <span>{text}</span>
            </div>
        </div>
    );
}
