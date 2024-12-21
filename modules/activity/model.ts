import { baseSchemaOptions } from "@/database/utils";
import { Model, model, models, Schema } from "mongoose";
import { ActivityMongo } from "./types";

const activityMongoSchema = new Schema<ActivityMongo>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
  },
  baseSchemaOptions
);

activityMongoSchema.index({ name: 1 }, { unique: true });

export const activityModel =
  (models.Activity as Model<ActivityMongo>) ??
  model("Activity", activityMongoSchema);
