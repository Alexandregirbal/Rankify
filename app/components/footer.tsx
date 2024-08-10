"use client";

import { ChartNoAxesCombined, SquarePlus, Trophy } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const isActiveTab = (tab: string) => {
    return pathname.toLowerCase() === tab.toLowerCase() ? "active" : "";
  };

  return (
    <footer className="btm-nav">
      <button
        disabled
        className={isActiveTab("/charts")}
        onClick={() => router.push("/charts")}
      >
        <ChartNoAxesCombined />
      </button>

      <button className={isActiveTab("/")} onClick={() => router.push("/")}>
        <Trophy />
      </button>

      <button className={isActiveTab("/add")}>
        <SquarePlus onClick={() => router.push("/add")} />
      </button>
    </footer>
  );
}
