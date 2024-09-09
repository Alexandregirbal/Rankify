import z from "@/database/extendedZod";
import { gameSchema } from "./schemas";

export type Game = z.infer<typeof gameSchema>;
