import { baseSchemaOptions } from "@/database/utils";
import { Model, model, models, Schema } from "mongoose";
import { ActivityMongo } from "./types";

const activityMongoSchema = new Schema<ActivityMongo>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false },
  },
  baseSchemaOptions
);

export const activityModel =
  (models.Activity as Model<ActivityMongo>) ??
  model("Activity", activityMongoSchema);
