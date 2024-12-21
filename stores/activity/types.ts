import { ActivityMongo } from "@/modules/activity/types";

export type ActivityState = {
  selectedActivity: Pick<ActivityMongo, "_id" | "name"> | null;
};

export type ActivityActions = {
  setSelectedActivity: (activity: Pick<ActivityMongo, "_id" | "name">) => void;
};

export type ActivityStore = ActivityState & ActivityActions;
