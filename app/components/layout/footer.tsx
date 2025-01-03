"use client";

import { ChartNoAxesCombined, SquarePlus, Trophy } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const params = useParams<{ activityName: string }>();

  const isActiveTab = (tab: string) => {
    const path = pathname.toLowerCase();
    const isActive =
      (tab === "stats" && path.endsWith("/stats")) ||
      (tab === "add" && path.endsWith("/add")) ||
      (tab === "leaderboard" && path.endsWith(params.activityName.toLowerCase()));
    return isActive ? "active bg-neutral" : "";
  };

  const buildLink = (tab: "stats" | "leaderboard" | "add") => {
    const { activityName } = params;
    if (!activityName) return "/";
    switch (tab) {
      case "stats":
        return `/${activityName}/stats`;
      case "leaderboard":
        return `/${activityName}`;
      case "add":
        return `/${activityName}/add`;
      default:
        return "/";
    }
  };

  return (
    <footer className="btm-nav bg-neutral">
      <Link prefetch={true} className={isActiveTab("stats")} href={buildLink("stats")}>
        <ChartNoAxesCombined />
      </Link>

      <Link prefetch={true} className={isActiveTab("leaderboard")} href={buildLink("leaderboard")}>
        <Trophy />
      </Link>

      <Link prefetch={true} className={isActiveTab("add")} href={buildLink("add")}>
        <SquarePlus />
      </Link>
    </footer>
  );
}
