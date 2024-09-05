export type UIState = {
  isLoading: boolean;
};

export type UIActions = {
  setIsLoading: (isLoading: boolean) => void;
};

export type UIStore = UIState & UIActions;
