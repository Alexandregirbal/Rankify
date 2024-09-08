import { zodSchema } from "@zodyac/zod-mongoose";
import { model } from "mongoose";
import { playerSchema } from "./schemas";

const playerModelSchema = zodSchema(playerSchema);

export const playerModel = model("player", playerModelSchema);
