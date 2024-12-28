"use client";

import { ChartNoAxesCombined, SquarePlus, Trophy } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Footer() {
  const pathname = usePathname();
  const params = useParams<{ activityName: string }>();

  const [activeTab, setActiveTab] = useState<
    null | "stats" | "leaderboard" | "add"
  >(null);

  useEffect(() => {
    if (pathname.toLowerCase().endsWith("/stats")) {
      setActiveTab("stats");
    } else if (pathname.toLowerCase().endsWith("/add")) {
      setActiveTab("add");
    } else if (pathname.endsWith(params.activityName)) {
      setActiveTab("leaderboard");
    } else {
      setActiveTab(null);
    }

    return () => {
      setActiveTab(null);
    };
  }, [pathname, params.activityName]);

  const isActiveTab = (tab: string) => {
    return activeTab === tab ? "active bg-neutral" : "";
  };

  const buildLink = (tab: "stats" | "leaderboard" | "add") => {
    const { activityName } = params;
    if (!activityName) return `/`;
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
      <Link className={isActiveTab("stats")} href={buildLink("stats")}>
        <ChartNoAxesCombined />
      </Link>

      <Link
        className={isActiveTab("leaderboard")}
        href={buildLink("leaderboard")}
      >
        <Trophy />
      </Link>

      <Link className={isActiveTab("add")} href={buildLink("add")}>
        <SquarePlus />
      </Link>
    </footer>
  );
}
