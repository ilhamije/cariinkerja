import Link from "next/link";
import Button from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/jobs/JobCard";

export default async function LandingPage() {
  const recentJobs = await prisma.job.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-white py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
            Jobs curated{" "}
            <span className="text-accent">just for you</span>
          </h1>
          <p className="mt-5 text-lg text-white/80 max-w-xl mx-auto">
            No algorithms. No AI. Ok, we used AI to build this. But a real human team reviews your profile and personally matches you to roles that fit. Subscribe free.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/subscribe">
              <Button variant="secondary" size="lg">
                Subscribe — it&apos;s free
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
                Browse all jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-primary text-center mb-12">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Subscribe", desc: "Sign up with LinkedIn or Google in seconds." },
              { step: "2", title: "Share your profile", desc: "Upload your CV and tell us what you're looking for." },
              { step: "3", title: "Get matched", desc: "Our curator reviews your profile and sends you relevant jobs directly." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                  {step}
                </div>
                <h3 className="font-semibold text-primary">{title}</h3>
                <p className="text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent jobs */}
      {recentJobs.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-primary">Recent openings</h2>
              <Link href="/jobs" className="text-sm text-accent hover:underline font-medium">
                View all →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4 bg-accent/10">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-primary">Ready to find your next role?</h2>
          <p className="mt-3 text-slate-600">Join and let us do the searching for you.</p>
          <Link href="/subscribe" className="mt-6 inline-block">
            <Button size="lg">Get started for free</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
