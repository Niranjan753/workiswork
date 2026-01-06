"use client";

import * as React from "react";
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
    categories: categories.slice(0, 6),
  });
  const [loading, setLoading] = React.useState(false);
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  const matches = React.useMemo(() => {
    if (!q.trim()) return categories.slice(0, 6);
    const lower = q.toLowerCase();
    return categories
      .filter((c) => c.label.toLowerCase().includes(lower))
      .slice(0, 6);
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
      className="relative mx-auto mt-4 flex max-w-3xl items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 shadow-sm"
    >
      <input
        type="text"
        name="q"
        placeholder="Search Job Title or Company name..."
        className="h-10 flex-1 rounded-full border-none bg-transparent text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // If the input is cleared and focus leaves, hide suggestions
          if (!q.trim()) {
            setOpen(false);
          }
        }}
        autoComplete="off"
      />
      <input type="hidden" name="category" value={selectedCategory} />
      <button
        type="submit"
        className="h-8 rounded-full bg-orange-500 px-4 text-xs font-semibold text-white cursor-pointer hover:bg-orange-600"
      >
        Search
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-full overflow-hidden rounded-xl border border-orange-200 bg-white shadow-lg">
          <div className="max-h-72 overflow-auto text-xs text-zinc-800">
            {loading && (
              <div className="px-4 py-2 text-[11px] text-zinc-500">
                Searching…
              </div>
            )}

            {suggestions.titles.length > 0 && (
              <>
                <div className="bg-orange-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-orange-700">
                  Job titles
                </div>
                <ul className="divide-y divide-orange-100">
                  {suggestions.titles.map((title) => (
                    <li key={title}>
                      <button
                        type="button"
                        onClick={() => selectTerm(title)}
                        className="flex w-full items-center justify-between px-4 py-2 text-left hover:bg-orange-50"
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
                <div className="bg-orange-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-orange-700">
                  Companies
                </div>
                <ul className="divide-y divide-orange-100">
                  {suggestions.companies.map((comp) => (
                    <li key={comp}>
                      <button
                        type="button"
                        onClick={() => selectTerm(comp)}
                        className="flex w-full items-center justify-between px-4 py-2 text-left hover:bg-orange-50"
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
                <div className="bg-orange-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-orange-700">
                  Categories
                </div>
                <ul className="divide-y divide-orange-100">
                  {matches.map((cat) => {
                    const isActive = selectedCategory === cat.slug;
                    return (
                      <li key={cat.slug}>
                        <button
                          type="button"
                          onClick={() => selectCategory(cat)}
                          className={cn(
                            "flex w-full items-center justify-between px-4 py-2 text-left hover:bg-orange-50",
                            isActive && "bg-orange-100/70 font-semibold",
                          )}
                        >
                          <span>{cat.label}</span>
                          {isActive && (
                            <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                              Selected
                            </span>
                          )}
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
                <div className="px-4 py-3 text-[11px] text-zinc-500">
                  No matches yet
                </div>
              )}
          </div>
        </div>
      )}
    </form>
  );
}


