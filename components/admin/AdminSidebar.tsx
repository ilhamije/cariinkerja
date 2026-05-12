"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/lib/actions/admin-logout";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/candidates", label: "Candidates" },
  { href: "/admin/matches", label: "Matches" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 p-4 flex flex-col gap-1">
      {NAV.map(({ href, label }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              active
                ? "bg-white/15 text-white font-medium"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({ userEmail }: { userEmail?: string }) {
  return (
    <div className="p-4 border-t border-white/10 flex items-center justify-between gap-2">
      <p className="text-xs text-white/50 truncate">{userEmail ?? "Admin"}</p>
      <form action={adminLogout}>
        <button
          type="submit"
          className="text-xs text-white/60 hover:text-white transition-colors"
        >
          Logout
        </button>
      </form>
    </div>
  );
}

export default function AdminSidebar({ userEmail }: { userEmail?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 bg-primary text-white flex-col">
        <div className="p-5 border-b border-white/10">
          <Link href="/" className="text-lg font-bold">Begawi</Link>
          <p className="text-xs text-white/60 mt-0.5">Admin panel</p>
        </div>
        <NavLinks />
        <SidebarFooter userEmail={userEmail} />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-primary text-white h-14 flex items-center justify-center px-4 shadow-md">
        <Link href="/" className="text-base font-bold">Begawi</Link>
      </div>

      {/* Sticky note toggle — replaces hamburger, visible on mobile */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className={`lg:hidden fixed top-10 left-0 z-[60] w-8 h-10 bg-accent flex items-center justify-center shadow-md transition-all duration-300 rounded-r-lg ${
          open ? "translate-x-64" : "translate-x-0"
        }`}
        style={{ clipPath: "polygon(0 0, 100% 5%, 100% 95%, 0 100%)" }}
      >
        <span
          className={`text-primary text-base font-bold transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          ›
        </span>
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-14 left-0 bottom-0 z-50 w-64 bg-primary text-white flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavLinks onNavigate={() => setOpen(false)} />
        <SidebarFooter userEmail={userEmail} />
      </aside>
    </>
  );
}
