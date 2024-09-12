"use client";

import { ChartNoAxesCombined, SquarePlus, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const isActiveTab = (tab: string) => {
    return pathname.toLowerCase() === tab.toLowerCase() ? "active" : "";
  };

  return (
    <footer className="btm-nav">
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
