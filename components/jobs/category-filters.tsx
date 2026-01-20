"use client";

import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { cn } from "../../lib/utils";

type Category = {
  label: string;
  slug: string;
};

type Props = {
  categories: Category[];
};

export function CategoryFilters({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const scrollPositionRef = React.useRef<number | null>(null);

  // Get all selected categories from URL
  const selectedCategories = React.useMemo(
    () => searchParams.getAll("category").filter(Boolean),
    [searchParams],
  );

  // Restore scroll position after category changes
  React.useEffect(() => {
    if (scrollPositionRef.current !== null) {
      const savedScroll = scrollPositionRef.current;
      scrollPositionRef.current = null; // Clear immediately

      // Restore scroll position aggressively
      const restoreScroll = () => {
        if (window.scrollY !== savedScroll) {
          window.scrollTo(0, savedScroll);
        }
      };

      // Restore immediately and multiple times
      restoreScroll();
      requestAnimationFrame(restoreScroll);
      setTimeout(restoreScroll, 0);
      setTimeout(restoreScroll, 10);
      setTimeout(restoreScroll, 50);
      setTimeout(restoreScroll, 100);
    }
  }, [selectedCategories]);

  const toggleCategory = React.useCallback(
    (slug: string, e: React.MouseEvent) => {
      e.preventDefault();

      // Store current scroll position BEFORE any navigation
      const currentScroll = window.scrollY;
      scrollPositionRef.current = currentScroll;

      const params = new URLSearchParams(searchParams.toString());

      // Remove q param if it exists (we'll add it back)
      if (q) {
        params.delete("q");
      }

      // Get current categories
      const current = params.getAll("category");

      // Toggle the category
      if (current.includes(slug)) {
        // Remove it
        params.delete("category");
        current
          .filter((c) => c !== slug)
          .forEach((c) => params.append("category", c));
      } else {
        // Add it
        params.append("category", slug);
      }

      // Add q back if it exists
      if (q) {
        params.set("q", q);
      }

      // Update URL
      const newUrl = `/jobs${params.toString() ? `?${params.toString()}` : ""}`;

      // Restore scroll immediately before navigation
      window.scrollTo(0, currentScroll);

      // Use router.replace
      router.replace(newUrl);

      // Aggressively restore scroll after navigation
      const restoreScroll = () => {
        if (window.scrollY !== currentScroll) {
          window.scrollTo(0, currentScroll);
        }
      };

      // Restore multiple times to catch any scroll resets
      requestAnimationFrame(restoreScroll);
      setTimeout(restoreScroll, 0);
      setTimeout(restoreScroll, 10);
      setTimeout(restoreScroll, 50);
      setTimeout(restoreScroll, 100);
      setTimeout(restoreScroll, 200);
    },
    [router, searchParams, q],
  );

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map(({ label, slug }) => {
        const isActive = selectedCategories.includes(slug);

        return (
          <button
            key={slug}
            type="button"
            onClick={(e) => toggleCategory(slug, e)}
            className={cn(
              "px-4 py-1.5 text-xs font-bold transition-all rounded-full cursor-pointer flex items-center gap-2",
              isActive
                ? "bg-[#2563EB] text-white"
                : "bg-zinc-900/50 text-zinc-500 border border-zinc-800 hover:bg-zinc-800 hover:text-white",
            )}
          >
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

