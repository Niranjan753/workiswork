"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
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

  const pathname = usePathname();

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
      const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;

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
    [router, searchParams, q, pathname],
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
              "px-5 py-2 text-sm font-bold transition-all rounded-full cursor-pointer flex items-center gap-2 border",
              isActive
                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                : "bg-white text-gray-500 border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50",
            )}
          >
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

