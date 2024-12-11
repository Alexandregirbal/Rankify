import { baseMongoSchema } from "@/database/utils";
import { z } from "zod";

export const activitySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export const activityMongoSchema = baseMongoSchema.merge(activitySchema);
