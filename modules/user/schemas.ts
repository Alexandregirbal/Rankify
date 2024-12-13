import { baseMongoSchema, zodObjectId } from "@/database/utils";
import { z } from "zod";

export const trophySchema = z.object({
  activityId: zodObjectId,
  activityName: z.string(),
  ranking: z.number(),
  rating: z.number(),
  season: z.number(),
});
export const userSchema = z.object({
  name: z.string(),
  trophies: z.array(trophySchema),
});

export const userMongoSchema = baseMongoSchema.merge(userSchema);
