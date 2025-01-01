import { createStore } from "zustand/vanilla";
import { ActivityState, ActivityStore } from "./types";

const defaultState: ActivityState = {
  selectedActivity: null,
};

export const createActivityStore = (
  initState: ActivityState = defaultState
) => {
  return createStore<ActivityStore>()((set) => ({
    ...initState,
    setSelectedActivity: (activity: ActivityState["selectedActivity"]) => {
      set({ selectedActivity: activity });
    },
  }));
};

export type ActivityStoreApi = ReturnType<typeof createActivityStore>;
