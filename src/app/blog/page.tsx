"use client";

import { useState, useCallback, useRef } from "react";
import { posts } from "@/data/posts";
import { BlogCard } from "@/components/blog/BlogCard";

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(value), 200);
  }, []);

  const sorted = [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const filtered = sorted.filter((p) => {
    if (!debouncedQuery) return true;
    const q = debouncedQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      {/* Hero bar */}
      <div className="grid-bg px-4 pb-10 pt-20 sm:px-6 sm:pb-14 sm:pt-24 md:pb-14 md:pt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#00F5C4]"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Insights &amp; Updates
          </p>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h1
              className="text-4xl font-black tracking-widest text-white sm:text-5xl md:text-7xl"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              BLOG
            </h1>
            {/* Search */}
            <div className="relative w-full max-w-xs sm:max-w-sm">
              <svg
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A8D]"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <label htmlFor="blog-search" className="sr-only">
                Search articles
              </label>
              <input
                id="blog-search"
                type="search"
                placeholder="Search articles…"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#111318] pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#6B7A8D] focus:border-[rgba(0,245,196,0.4)] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 sm:py-14 sm:space-y-14">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-[#6B7A8D] text-lg">
              No articles match your search.
            </p>
          </div>
        ) : (
          <>
            {/* Featured post — CSS card-enter animation, immune to React StrictMode */}
            {featured && (
              <section>
                <p
                  className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  Latest Article
                </p>
                <div style={{ animation: "card-enter 0.5s ease-out both" }}>
                  <BlogCard post={featured} featured />
                </div>
              </section>
            )}

            {/* Remaining posts grid — staggered via animation-delay */}
            {rest.length > 0 && (
              <section>
                <p
                  className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#6B7A8D]"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  More Articles
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post, i) => (
                    <div
                      key={post.slug}
                      style={{
                        animation: `card-enter 0.5s ease-out ${i * 70}ms both`,
                      }}
                    >
                      <BlogCard post={post} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
