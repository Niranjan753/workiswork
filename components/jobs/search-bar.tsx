"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import { Search } from "lucide-react";

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

  const pathname = usePathname();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (selectedCategory) params.set("category", selectedCategory);
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
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
      className="relative w-full"
    >
      <div className="relative flex items-center group">
        <Search className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          name="q"
          placeholder="Search for jobs..."
          className="h-14 w-full pl-12 pr-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all font-sans text-base shadow-sm"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setTimeout(() => {
              setOpen(false);
            }, 200);
          }}
          autoComplete="off"
        />
      </div>
      <input type="hidden" name="category" value={selectedCategory} />

      {open && (
        <div
          className="absolute left-0 top-full z-30 mt-2 w-full overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="px-4 py-4 text-sm text-gray-400 text-center">
                <div className="inline-block animate-pulse">Searching…</div>
              </div>
            )}

            {!loading && !q.trim() && matches.length > 0 && (
              <>
                <div className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 border-b border-gray-100">
                  Quick categories
                </div>
                <ul className="divide-y divide-gray-100">
                  {matches.map((cat) => {
                    const isActive = selectedCategory === cat.slug;
                    return (
                      <li key={cat.slug}>
                        <button
                          type="button"
                          onClick={() => selectCategory(cat)}
                          className={cn(
                            "flex w-full items-center justify-between px-4 py-3 text-left text-[15px] text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors",
                            isActive && "bg-blue-50 text-blue-600 font-bold",
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
                    <div className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 border-b border-gray-100">
                      Suggested titles
                    </div>
                    <ul className="divide-y divide-gray-100">
                      {suggestions.titles.map((title) => (
                        <li key={title}>
                          <button
                            type="button"
                            onClick={() => selectTerm(title)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 hover:text-blue-600 text-[15px] text-gray-600 transition-colors"
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
                    <div className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 border-b border-gray-100">
                      Companies
                    </div>
                    <ul className="divide-y divide-gray-100">
                      {suggestions.companies.map((comp) => (
                        <li key={comp}>
                          <button
                            type="button"
                            onClick={() => selectTerm(comp)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 hover:text-blue-600 text-[15px] text-gray-600 transition-colors"
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
                    <div className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 border-b border-gray-100">
                      Matching categories
                    </div>
                    <ul className="divide-y divide-gray-100">
                      {matches.map((cat) => {
                        const isActive = selectedCategory === cat.slug;
                        return (
                          <li key={cat.slug}>
                            <button
                              type="button"
                              onClick={() => selectCategory(cat)}
                              className={cn(
                                "flex w-full items-center justify-between px-4 py-3 text-left text-[15px] text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors",
                                isActive && "bg-blue-50 text-blue-600 font-bold",
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
                    <div className="px-4 py-8 text-sm text-gray-400 text-center font-medium">
                      No matches found
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
