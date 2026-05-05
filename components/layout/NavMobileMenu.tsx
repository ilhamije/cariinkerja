"use client";

import { useState } from "react";
import Link from "next/link";

interface Props {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

export default function NavMobileMenu({ isLoggedIn, isAdmin }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <>
          <div
            className="sm:hidden fixed inset-0 z-30 top-16"
            onClick={() => setOpen(false)}
          />
          <div className="sm:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b border-slate-100 shadow-lg p-4 flex flex-col gap-1">
            <Link
              href="/jobs"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Browse Jobs
            </Link>
            {isLoggedIn && (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Admin
              </Link>
            )}
            <div className="border-t border-slate-100 mt-1 pt-1">
              {isLoggedIn ? (
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Sign out
                  </button>
                </form>
              ) : (
                <Link
                  href="/subscribe"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-slate-50 transition-colors"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
