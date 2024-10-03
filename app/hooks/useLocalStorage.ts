"use client";

import { useState } from "react";

export const localStorageKeys = {
  adminToken: "adminToken",
} as const;

function useLocalStorage<T>({
  key,
  initialValue,
}: {
  key: keyof typeof localStorageKeys;
  initialValue: T;
}) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage (key: ${key})`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage (key: ${key})`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;