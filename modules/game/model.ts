import { zodSchema } from "@zodyac/zod-mongoose";
import { model } from "mongoose";
import { gameSchema } from "./schemas";

const gameModelSchema = zodSchema(gameSchema);

export const gameModel = model("Game", gameModelSchema);
