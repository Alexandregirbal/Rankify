"use server";

import { getActivityId, getAllActivities } from "@/modules/activity/get";
import { getAllPlayersOfActivity } from "@/modules/player/get";
import { ActivityNameParams } from "../types";
import AddGame from "./components/addGame";

export async function generateStaticParams() {
  const activities = await getAllActivities();

  return activities.map((activity) => ({
    activityName: activity.name,
  }));
}

export default async function AddPage({ params }: ActivityNameParams) {
  const { activityName } = await params;
  const activityId = await getActivityId(activityName);
  if (!activityId) return <div>Activity not found</div>;

  const allPlayers = await getAllPlayersOfActivity({ activityId });

  return (
    <div className="h-full w-full px-4 flex flex-col items-center gap-4 p-4 overflow-y-scroll background">
      <AddGame
        allPlayers={allPlayers.sort((a, b) =>
          a.userName > b.userName ? 1 : -1
        )}
        activityId={activityId}
      />
    </div>
  );
}
