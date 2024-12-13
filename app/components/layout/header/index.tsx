"use server";

import { getAllActivities } from "@/modules/activity/get";
import Image from "next/image";
import Link from "next/link";
import SelectActivity from "./selectActivity";

export default async function Header() {
  const activities = await getAllActivities();

  return (
    <header className="p-2 w-full background flex flex-row justify-between">
      <SelectActivity activities={activities} />
      <Link href="/">
        <Image alt="App logo" src="/logo-512x512.png" width={48} height={48} />
      </Link>
    </header>
  );
}
