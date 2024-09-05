import { Player } from "@/modules/elo/types";

export type Game = {
  team1: Array<Player>;
  team2: Array<Player>;
  scores: Array<number>;
  winner: string;
  createdAt: Date;
};
