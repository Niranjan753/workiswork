"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "../../lib/utils";

type Suggestion = {
  titles: string[];
  companies: string[];
  categories: Category[];
};

type Category = { label: string; slug: string };

type Props = {
  categories: Category[];
};

export function JobsSearchBar({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "";

  const [q, setQ] = React.useState(initialQ);
  const [selectedCategory, setSelectedCategory] = React.useState(
    initialCategory,
  );
  const [open, setOpen] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<Suggestion>({
    titles: [],
    companies: [],
    categories: categories,
  });
  const [loading, setLoading] = React.useState(false);
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  const matches = React.useMemo(() => {
    if (!q.trim()) return categories;
    const lower = q.toLowerCase();
    return categories
      .filter((c) => c.label.toLowerCase().includes(lower));
  }, [q, categories]);

  // Fetch live suggestions for titles/companies when typing
  React.useEffect(() => {
    if (!q.trim()) {
      setSuggestions((prev) => ({
        ...prev,
        titles: [],
        companies: [],
        categories: matches,
      }));
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/jobs?q=${encodeURIComponent(q)}&limit=10`);
        if (!res.ok) throw new Error("suggest failed");
        const data = await res.json();
        const titlesSet = new Set<string>();
        const companiesSet = new Set<string>();
        (data.jobs || []).forEach((job: any) => {
          if (job.title) titlesSet.add(job.title);
          if (job.companyName) companiesSet.add(job.companyName);
        });
        setSuggestions({
          titles: Array.from(titlesSet).slice(0, 6),
          companies: Array.from(companiesSet).slice(0, 6),
          categories: matches,
        });
      } catch (e) {
        // ignore fetch errors for suggestions
      } finally {
        setLoading(false);
      }
    }, 150);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q, matches]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (selectedCategory) params.set("category", selectedCategory);
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
    setOpen(false);
  }

  function selectCategory(cat: Category) {
    setSelectedCategory(cat.slug);
    setQ(cat.label);
    setOpen(false);
  }

  function selectTerm(term: string) {
    setQ(term);
    setOpen(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative mt-0 flex w-full max-w-3xl items-center gap-2 border-2 border-black bg-white px-4 py-2 rounded-lg"
    >
      <input
        type="text"
        name="q"
        placeholder="Search Job Title or Company name..."
        className="h-12 flex-1 border-none bg-transparent text-sm text-black placeholder:text-black/50 focus:outline-none"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // Delay closing to allow clicks on dropdown items
          setTimeout(() => {
            setOpen(false);
          }, 200);
        }}
        autoComplete="off"
      />
      <input type="hidden" name="category" value={selectedCategory} />
      <button
        type="submit"
        className="px-6 py-2 bg-black text-white text-sm font-bold cursor-pointer hover:bg-gray-900 transition-colors rounded-md"
      >
        Search
      </button>

      {open && (
        <div 
          className="absolute left-0 top-full z-30 mt-2 w-full overflow-hidden rounded-xl bg-white border-2 border-black shadow-lg"
          onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking dropdown
        >
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="px-4 py-3 text-sm text-black/60">
                Searching…
              </div>
            )}

            {!loading && !q.trim() && matches.length > 0 && (
              <>
                <div className="px-4 py-3 text-sm font-bold text-black">
                  CATEGORIES
                </div>
                <ul>
                  {matches.map((cat, index) => {
                    const isActive = selectedCategory === cat.slug;
                    return (
                      <li key={cat.slug}>
                        {index > 0 && <hr className="border-0 border-t border-gray-200 mx-0" />}
                        <button
                          type="button"
                          onClick={() => selectCategory(cat)}
                          className={cn(
                            "flex w-full items-center justify-between px-4 py-3 text-left text-sm text-black hover:bg-gray-50 transition-colors",
                            isActive && "bg-black text-white hover:bg-gray-900",
                          )}
                        >
                          <span>{cat.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            {!loading && q.trim() && (
              <>
                {suggestions.titles.length > 0 && (
                  <>
                    <div className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-black bg-gray-50">
                      Job titles
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {suggestions.titles.map((title) => (
                        <li key={title} className="border-t border-gray-200 first:border-t-0">
                          <button
                            type="button"
                            onClick={() => selectTerm(title)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 text-sm text-black"
                          >
                            <span>{title}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {suggestions.companies.length > 0 && (
                  <>
                    <div className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-black bg-gray-50">
                      Companies
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {suggestions.companies.map((comp) => (
                        <li key={comp} className="border-t border-gray-200 first:border-t-0">
                          <button
                            type="button"
                            onClick={() => selectTerm(comp)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 text-sm text-black"
                          >
                            <span>{comp}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {matches.length > 0 && (
                  <>
                    <div className="px-4 py-3 text-sm font-bold text-black">
                      CATEGORIES
                    </div>
                    <ul>
                      {matches.map((cat, index) => {
                        const isActive = selectedCategory === cat.slug;
                        return (
                          <li key={cat.slug}>
                            {index > 0 && <hr className="border-0 border-t border-gray-200 mx-0" />}
                            <button
                              type="button"
                              onClick={() => selectCategory(cat)}
                              className={cn(
                                "flex w-full items-center justify-between px-4 py-3 text-left text-sm text-black hover:bg-gray-50 transition-colors",
                                isActive && "bg-black text-white hover:bg-gray-900",
                              )}
                            >
                              <span>{cat.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}

                {suggestions.titles.length === 0 &&
                  suggestions.companies.length === 0 &&
                  matches.length === 0 && (
                    <div className="px-4 py-4 text-sm text-black/60">
                      No matches yet
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      )}
    </form>
  );
}

