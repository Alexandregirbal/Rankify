"use server";

import { getAllActivities } from "@/modules/activity/get";
import LinkButton from "./components/ui/linkButton";

export default async function HomePage() {
  const activities = await getAllActivities();

  return (
    <div className="h-full w-full pt-4 gap-6 flex flex-col items-center justify-start">
      <h1 className=" text-2xl ">Bienvenue sur Rankify</h1>
      <h2>Choisi ton jeu:</h2>
      <ol className="px-4 grid grid-cols-3 gap-4">
        {activities.map((activity) => (
          <li key={activity._id.toString()}>
            <LinkButton text={activity.name} href={activity.name} />
          </li>
        ))}
      </ol>
    </div>
  );
}
