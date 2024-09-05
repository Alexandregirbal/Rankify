import { createStore } from "zustand/vanilla";
import { UIState, UIStore } from "./types";

const defaultState: UIState = {
  isLoading: false,
};

export const createUIStore = (initState: UIState = defaultState) => {
  return createStore<UIStore>()((set) => ({
    ...initState,
    setIsLoading: (isLoading: boolean) => {
      set(() => ({ isLoading }));
    },
  }));
};

export type UIStoreApi = ReturnType<typeof createUIStore>;
