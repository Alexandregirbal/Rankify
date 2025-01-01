"use client";

import { useUIStore } from "@/stores/ui/provider";
import clsx from "clsx";
import Link from "next/link";

export default function LinkButton({
  text,
  href,
  className,
}: {
  text: string;
  href: string;
  className?: string;
}) {
  const { setIsLoading } = useUIStore((state) => state);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  return (
    <Link
      className={clsx("btn btn-accent w-full text-white", className)}
      href={href}
      onClick={handleClick}
    >
      {text}
    </Link>
  );
}
