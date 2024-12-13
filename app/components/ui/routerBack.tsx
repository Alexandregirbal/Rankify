"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RouterBack() {
  const router = useRouter();

  return (
    <div
      className="absolute left-0 cursor-pointer"
      onClick={() => router.back()}
    >
      <ArrowLeft />
    </div>
  );
}
