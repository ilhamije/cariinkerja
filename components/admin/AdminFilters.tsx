"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface FilterOption {
  value: string;
  label: string;
}

interface Props {
  searchPlaceholder: string;
  filterLabel: string;
  filterOptions: FilterOption[];
  clearHref: string;
  q?: string;
  filterValue?: string;
  filterName?: string;
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

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CustomDropdown({
  name,
  value,
  placeholder,
  options,
  onChange,
}: {
  name: string;
  value: string;
  placeholder: string;
  options: FilterOption[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-10 w-full flex items-center justify-between gap-2 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 hover:border-accent transition-colors"
      >
        <span className={selected ? "text-slate-800 font-medium" : "text-slate-400"}>
          {selected?.label ?? placeholder}
        </span>
        <IconChevron open={open} />
      </button>

      {/* Hidden input so the value is included in form submissions */}
      <input type="hidden" name={name} value={value} />

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <button
            type="button"
            onClick={() => { onChange(""); setOpen(false); }}
            className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${!value ? "bg-accent/10 text-primary font-medium" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {placeholder}
          </button>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${value === opt.value ? "bg-accent/10 text-primary font-medium" : "text-slate-700 hover:bg-slate-50"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminFilters({
  searchPlaceholder,
  filterLabel,
  filterOptions,
  clearHref,
  q,
  filterValue,
  filterName = "filter",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [text, setText] = useState(q ?? "");
  const [selected, setSelected] = useState(filterValue ?? "");

  function navigate(newText: string, newFilter: string) {
    const params = new URLSearchParams();
    if (newText) params.set("q", newText);
    if (newFilter) params.set(filterName, newFilter);
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleFilterChange(value: string) {
    setSelected(value);
    navigate(text, value);
  }

  function handleSearch() {
    navigate(text, selected);
  }

  const hasActiveFilter = !!(text || selected);

  return (
    <div className="flex flex-col gap-2 mb-6">
      {/* Row 1: search bar full width */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder={searchPlaceholder}
        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      />

      {/* Row 2: dropdown + icon button */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <CustomDropdown
            name={filterName}
            value={selected}
            placeholder={filterLabel}
            options={filterOptions}
            onChange={handleFilterChange}
          />
        </div>

        {hasActiveFilter ? (
          <a
            href={clearHref}
            title="Clear filters"
            onClick={() => { setText(""); setSelected(""); }}
            className="h-10 w-10 shrink-0 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors flex items-center justify-center"
          >
            <IconClear />
          </a>
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
    </div>
  );
}
