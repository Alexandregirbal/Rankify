"use client";

import { Activity, ActivityMongo } from "@/modules/activity/types";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function SelectActivity({
  activities,
}: {
  activities: Array<ActivityMongo>;
}) {
  const router = useRouter();
  const params = useParams<{ activityName: string }>();

  const [selectedActivity, setSelectedActivity] = useState<Activity["name"]>(
    params.activityName ?? activities[0].name
  );

  const handleActivityNameChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setSelectedActivity(selectedName);
    router.replace(selectedName);
  };

  useEffect(() => {
    if (params.activityName) {
      setSelectedActivity(params.activityName);
    }
  }, [params.activityName]);

  return (
    <select
      className="background select select-ghost border-none focus:outline-none"
      onChange={handleActivityNameChange}
      value={selectedActivity}
    >
      {activities.map((activity) => (
        <option key={activity._id.toString()} value={activity.name}>
          {activity.name}
        </option>
      ))}
    </select>
  );
}
