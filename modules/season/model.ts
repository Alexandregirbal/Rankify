import { baseSchemaOptions } from "@/database/utils";
import { model, Model, models, Schema } from "mongoose";
import { Leaderboard, SeasonMongo } from "./types";

const leaderboardModelSchema = new Schema<Leaderboard>(
  {
    ranking: { type: Number, required: true },
    playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    playerName: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  { _id: false }
);

const seasonModelSchema = new Schema<SeasonMongo>(
  {
    number: { type: Number, required: true, default: 1 },
    activityId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Activity",
    },
    activityName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    state: { type: String, enum: ["active", "ended"], required: true },
    details: { type: String, required: false },
    leaderboard: { type: [leaderboardModelSchema], required: false },
    archives: { type: Schema.Types.Mixed, required: false },
  },
  baseSchemaOptions
);

seasonModelSchema.index({ activityId: 1 });

export const seasonModel =
  (models.Season as Model<SeasonMongo>) ?? model("Season", seasonModelSchema);
