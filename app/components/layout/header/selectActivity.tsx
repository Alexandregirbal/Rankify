"use client";

import { ActivityMongo } from "@/modules/activity/types";
import { useActivityStore } from "@/stores/activity/provider";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect } from "react";

export default function SelectActivity({
  activities,
}: {
  activities: Array<ActivityMongo>;
}) {
  const router = useRouter();
  const params = useParams<{ activityName: string }>();
  const { selectedActivity, setSelectedActivity } = useActivityStore(
    (state) => state
  );

  const changeActivity = useCallback(
    (activityName: string, pushRoute = true) => {
      const matchingActivity = activities.find(
        (act) => act.name === activityName
      );
      if (!matchingActivity) return;

      setSelectedActivity({
        _id: matchingActivity._id,
        name: matchingActivity.name,
      });

      if (pushRoute) router.push(`/${matchingActivity.name}`);
    },
    [activities, setSelectedActivity, router]
  );

  const handleActivityNameChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    changeActivity(selectedName);
  };

  useEffect(() => {
    if (params.activityName) {
      changeActivity(params.activityName, false);
    }
  }, [params.activityName, changeActivity]);

  return (
    <select
      className="background select select-ghost border-none focus:outline-none"
      onChange={handleActivityNameChange}
      value={selectedActivity?.name}
    >
      {activities.map((activity) => (
        <option key={activity._id.toString()} value={activity.name}>
          {activity.name}
        </option>
      ))}
    </select>
  );
}
