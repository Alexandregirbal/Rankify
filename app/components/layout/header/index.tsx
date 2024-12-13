"use server";

import { getAllActivities } from "@/modules/activity/get";
import SelectActivity from "./selectActivity";

export default async function Header() {
  const activities = await getAllActivities();

  return (
    <header className="w-full background">
      <SelectActivity activities={activities} />
    </header>
  );
}
