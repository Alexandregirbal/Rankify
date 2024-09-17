"use client";

import { useUIStore } from "@/stores/ui/provider";
import { useState } from "react";

export default function AdminPage() {
  const { setIsLoading } = useUIStore((state) => state);
  const [rollbackResult, setRollbackResult] = useState<any>("No result yet");
  const runRollbackLastGame = async () => {
    setIsLoading(true);
    return fetch("/api/admin/game", {
      method: "PUT",
      body: JSON.stringify({
        updateType: "rollback",
        gameId: "62d0c839e9d2e3a1d5e5d6e7",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRollbackResult(data.report);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-center text-2xl">Admin page</h1>

      <ul className="w-full flex flex-col gap-4">
        <li className="flex flex-col gap-4 items-center ">
          <div className="flex gap-4 items-center w-full text-lg">
            <button
              className="btn btn-accent text-white btn-sm"
              onClick={runRollbackLastGame}
            >
              Run
            </button>
            <span>Rollback last game played</span>
          </div>
          {rollbackResult && (
            <pre className="text-sm border border-base-content rounded-md p-4 w-full max-h-60 overflow-y-scroll">
              <code>{JSON.stringify(rollbackResult.rollback, null, 2)}</code>
            </pre>
          )}
        </li>
      </ul>
    </div>
  );
}
