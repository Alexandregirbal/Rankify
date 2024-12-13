"use client";

import { Activity, ActivityMongo } from "@/modules/activity/types";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

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
    router.push(selectedName);
  };

  return (
    <select
      className="background select select-ghost w-1/3 border-none focus:outline-none"
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
