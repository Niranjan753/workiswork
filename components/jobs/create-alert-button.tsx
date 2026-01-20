"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CreateAlertButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/alerts");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="px-5 py-2 text-xs font-bold text-foreground border border-border rounded-md hover:bg-secondary transition-all shadow-sm"
    >
      Create alert
    </button>
  );
}
