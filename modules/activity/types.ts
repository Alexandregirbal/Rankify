import { z } from "zod";
import { activityMongoSchema, activitySchema } from "./schemas";

export type Activity = z.infer<typeof activitySchema>;

export type ActivityMongo = z.infer<typeof activityMongoSchema>;
