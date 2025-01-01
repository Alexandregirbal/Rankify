import { z } from "zod";
import { trophySchema, userMongoSchema, userSchema } from "./schemas";

export type Trophy = z.infer<typeof trophySchema>;

export type User = z.infer<typeof userSchema>;
export type UserMongo = z.infer<typeof userMongoSchema>;
