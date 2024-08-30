"use client";
import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";
import { createUIStore, type UIStoreApi } from "./store";
import { UIStore } from "./types";

export const UIStoreContext = createContext<UIStoreApi | undefined>(undefined);

export interface UIStoreProviderProps {
  children: ReactNode;
}

export const UIStoreProvider = ({ children }: UIStoreProviderProps) => {
  const storeRef = useRef<UIStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createUIStore();
  }

  return (
    <UIStoreContext.Provider value={storeRef.current}>
      {children}
    </UIStoreContext.Provider>
  );
};

export const useUIStore = <T>(selector: (store: UIStore) => T): T => {
  const UIStoreContext = useContext(UIStoreContext);

  if (!UIStoreContext) {
    throw new Error(`useUIStore must be used within UIStoreProvider`);
  }

  return useStore(UIStoreContext, selector);
};
