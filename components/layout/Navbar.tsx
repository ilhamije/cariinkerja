import Link from "next/link";
import { auth } from "@/lib/auth";
import Button from "@/components/ui/Button";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">CariinKerja</span>
          <span className="hidden sm:inline text-xs bg-accent/20 text-primary px-2 py-0.5 rounded-full font-medium">
            Curated
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/jobs" className="text-sm text-slate-600 hover:text-primary transition-colors">
            Browse Jobs
          </Link>

          {session ? (
            <>
              <Link href="/dashboard" className="text-sm text-slate-600 hover:text-primary transition-colors">
                Dashboard
              </Link>
              {session.user.isAdmin && (
                <Link href="/admin" className="text-sm text-slate-600 hover:text-primary transition-colors">
                  Admin
                </Link>
              )}
              <form action="/api/auth/signout" method="POST">
                <Button variant="outline" size="sm" type="submit">Sign out</Button>
              </form>
            </>
          ) : (
            <Link href="/subscribe">
              <Button size="sm">Get Started</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
