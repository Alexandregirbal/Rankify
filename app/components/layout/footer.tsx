"use client";

import { ChartNoAxesCombined, SquarePlus, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const isActiveTab = (tab: string) => {
    return pathname.toLowerCase() === tab.toLowerCase()
      ? "active bg-neutral"
      : "";
  };

  return (
    <footer className="btm-nav bg-neutral">
      <Link className={isActiveTab("/stats")} href={"/stats"}>
        <ChartNoAxesCombined />
      </Link>

      <Link className={isActiveTab("/")} href={"/"}>
        <Trophy />
      </Link>

      <Link className={isActiveTab("/add")} href={"/add"}>
        <SquarePlus />
      </Link>
    </footer>
  );
}
