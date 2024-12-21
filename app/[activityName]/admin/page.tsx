"use client";

import { HEADER_VARIABLES } from "@/app/constants";
import useLocalStorage, { localStorageKeys } from "@/app/hooks/useLocalStorage";
import { useActivityStore } from "@/stores/activity/provider";
import { useUIStore } from "@/stores/ui/provider";
import { useState } from "react";

export default function AdminPage() {
  const { setIsLoading } = useUIStore((state) => state);
  const { selectedActivity } = useActivityStore((state) => state);

  // const [localAdminToken, setLocalAdminToken] = useState<string>("");
  const [adminToken, setAdminToken] = useLocalStorage<string>({
    key: localStorageKeys.adminToken,
    initialValue: "",
  });
  const [rollbackResult, setRollbackResult] = useState<any>();
  const [endSeasonResult, setEndSeasonResult] = useState<any>();

  if (!selectedActivity) {
    return <div>Select an activity</div>;
  }

  const runRollbackLastGame = async () => {
    setIsLoading(true);
    return fetch("/api/admin/game", {
      method: "PUT",
      body: JSON.stringify({
        updateType: "rollback",
      }),
      headers: {
        [HEADER_VARIABLES.adminToken]: adminToken,
        [HEADER_VARIABLES.activityId]: selectedActivity?._id.toString(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRollbackResult(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const endSeasonNow = async () => {
    setIsLoading(true);
    return fetch("/api/admin/season", {
      method: "POST",
      body: JSON.stringify({
        updateType: "end_season",
      }),
      headers: {
        [HEADER_VARIABLES.adminToken]: adminToken,
        [HEADER_VARIABLES.activityId]: selectedActivity?._id.toString(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setEndSeasonResult(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-center text-2xl">Admin page</h1>
      <input
        type="text"
        className="input input-bordered"
        placeholder="Enter admin token here"
        value={adminToken}
        onChange={(e) => setAdminToken(e.target.value)}
      />

      <ul className="w-full flex flex-col gap-4">
        <li className="flex flex-col gap-4 items-center">
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
              <code>{JSON.stringify(rollbackResult, null, 2)}</code>
            </pre>
          )}
        </li>
        <li className="flex flex-col gap-4 items-center ">
          <div className="flex gap-4 items-center w-full text-lg">
            <button
              className="btn btn-accent text-white btn-sm"
              onClick={endSeasonNow}
            >
              Run
            </button>
            <span>End season now</span>
          </div>
          {endSeasonResult && (
            <pre className="text-sm border border-base-content rounded-md p-4 w-full max-h-60 overflow-y-scroll">
              <code>{JSON.stringify(endSeasonResult, null, 2)}</code>
            </pre>
          )}
        </li>
      </ul>
    </div>
  );
}
