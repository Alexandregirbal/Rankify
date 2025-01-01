"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";
import { createActivityStore, type ActivityStoreApi } from "./store";
import { ActivityStore } from "./types";

export const ActivityStoreContext = createContext<ActivityStoreApi | undefined>(
  undefined
);

export interface ActivityStoreProviderProps {
  children: ReactNode;
}

export const ActivityStoreProvider = ({
  children,
}: ActivityStoreProviderProps) => {
  const storeRef = useRef<ActivityStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createActivityStore();
  }

  return (
    <ActivityStoreContext.Provider value={storeRef.current}>
      {children}
    </ActivityStoreContext.Provider>
  );
};

export const useActivityStore = <T,>(
  selector: (store: ActivityStore) => T
): T => {
  const activityStoreContext = useContext(ActivityStoreContext);

  if (!activityStoreContext) {
    throw new Error(
      `useActivityStore must be used within ActivityStoreProvider`
    );
  }

  return useStore(activityStoreContext, selector);
};
