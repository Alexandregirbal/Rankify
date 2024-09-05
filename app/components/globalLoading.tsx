"use client";
import { useUIStore } from "@/stores/ui/provider";

export default function GlobalLoading() {
  const isLoading = useUIStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <div className="z-10 h-full w-full absolute top-0 left-0 flex flex-col items-center justify-center gap-4 p-4 overflow-y-scroll bg-opacity-20 backdrop-blur-sm bg-accent">
        <span className="loading loading-ring loading-lg text-white"></span>
      </div>
    );
  }

  return <></>;
}
