import { baseSchemaOptions } from "@/database/utils";
import { Model, model, models, Schema } from "mongoose";
import { Trophy, UserMongo } from "./types";

const trophyModelSchema = new Schema<Trophy>(
  {
    activityId: { type: Schema.Types.ObjectId, required: true },
    activityName: { type: String, required: true },
    ranking: { type: Number, required: true },
    rating: { type: Number, required: true },
    season: { type: Number, required: true },
  },
  { _id: false }
);

const userMongoSchema = new Schema<UserMongo>(
  {
    name: { type: String, required: true, unique: true },
    trophies: { type: [trophyModelSchema], required: false },
  },
  baseSchemaOptions
);

export const userModel =
  (models.User as Model<UserMongo>) ?? model("User", userMongoSchema);
