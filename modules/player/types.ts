import z from "@/database/extendedZod";
import { minimalPlayerSchema, playerSchema } from "./schemas";

export type Player = z.infer<typeof playerSchema>;

export type MinimalPlayer = z.infer<typeof minimalPlayerSchema>;
