"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface Props {
  q?: string;
}

function IconSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconClear() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18" /><path d="M6 6l12 12" />
    </svg>
  );
}

export default function JobsFilter({ q = "" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [text, setText] = useState(q);

  function handleSearch() {
    const params = new URLSearchParams();
    if (text) params.set("q", text);
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleClear() {
    setText("");
    router.push(pathname);
  }

  return (
    <div className="flex items-center gap-2 mb-6">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Search by title or company…"
        className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      />

      {text ? (
        <button
          type="button"
          title="Clear search"
          onClick={handleClear}
          className="h-10 w-10 shrink-0 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors flex items-center justify-center"
        >
          <IconClear />
        </button>
      ) : (
        <button
          type="button"
          title="Search"
          onClick={handleSearch}
          className="h-10 w-10 shrink-0 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center"
        >
          <IconSearch />
        </button>
      )}
    </div>
  );
}
