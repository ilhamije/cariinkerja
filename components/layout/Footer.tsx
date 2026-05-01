import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-100 bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} CariinKerja. Human-curated jobs.
        </p>
        <nav className="flex items-center gap-4 text-sm text-slate-500">
          <Link href="/jobs" className="hover:text-primary transition-colors">Browse Jobs</Link>
          <Link href="/subscribe" className="hover:text-primary transition-colors">Subscribe</Link>
        </nav>
      </div>
    </footer>
  );
}
