import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

const candidates = [
  {
    email: "ahmad.fauzi@example.com",
    name: "Ahmad Fauzi",
    provider: "google",
    status: "ACTIVE",
    preferences:
      "Full-stack engineer with 5 years of experience in React and Node.js. Looking for remote-friendly roles in fintech or edtech startups.",
    linkedinUrl: "https://linkedin.com/in/ahmad-fauzi",
  },
  {
    email: "badru.samudra@example.com",
    name: "Badru Samudra",
    provider: "linkedin",
    status: "UNDER_REVIEW",
    preferences:
      "Product designer with a background in UI/UX and design systems. 3 years at an e-commerce startup, passionate about mobile-first design.",
    linkedinUrl: "https://linkedin.com/in/badru-samudra",
  },
  {
    email: "chairul.anam@example.com",
    name: "Chairul Anam",
    provider: "google",
    status: "PENDING",
    preferences:
      "Data analyst transitioning to data science. Skilled in Python, SQL, and Tableau. Background in FMCG market research.",
    linkedinUrl: null,
  },
  {
    email: "denny.kristianto@example.com",
    name: "Denny Kristianto",
    provider: "linkedin",
    status: "ACTIVE",
    preferences:
      "Backend engineer specialising in Go and distributed systems. 7 years of experience, previously at a logistics tech company.",
    linkedinUrl: "https://linkedin.com/in/denny-kristianto",
  },
  {
    email: "eko.prasetyo@example.com",
    name: "Eko Prasetyo",
    provider: "google",
    status: "PAUSED",
    preferences:
      "Digital marketing specialist with expertise in SEO, paid ads, and content strategy. 4 years growing D2C brands from scratch.",
    linkedinUrl: "https://linkedin.com/in/eko-prasetyo",
  },
];

const jobs = [
  {
    title: "Senior Frontend Engineer",
    company: "TechStartup Inc",
    location: "Jakarta",
    remote: true,
    type: "FULL_TIME",
    salary: "Rp 25–35M/mo",
    description:
      "We're looking for an experienced frontend engineer to lead our product team. You'll work with React, TypeScript, and our design system. Experience with performance optimization and accessibility is a plus.",
    tags: "React, TypeScript, Remote, Startup",
    slug: "senior-frontend-engineer-techstartup-inc",
    published: true,
    applyUrl: "https://linkedin.com/jobs/senior-frontend-engineer",
    expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
  },
  {
    title: "Backend Engineer (Go)",
    company: "DistribSys Ltd",
    location: "Singapore",
    remote: true,
    type: "FULL_TIME",
    salary: "SGD 12–16k/mo",
    description:
      "Build scalable backend systems with Go. We work on high-throughput distributed systems processing millions of requests daily. Must have strong fundamentals in concurrency and systems design.",
    tags: "Go, Backend, Distributed Systems, Remote",
    slug: "backend-engineer-go-distribsys-ltd",
    published: true,
    applyUrl: null,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  },
  {
    title: "Product Designer",
    company: "DesignCo",
    location: "Bandung",
    remote: false,
    type: "FULL_TIME",
    salary: "Rp 18–25M/mo",
    description:
      "Join our design team to shape the future of our SaaS platform. We're looking for someone passionate about user research, prototyping, and design systems. Portfolio required.",
    tags: "Design, UI/UX, Figma, Product",
    slug: "product-designer-designco",
    published: true,
    applyUrl: null,
    expiresAt: null, // Never expires
  },
  {
    title: "Data Scientist",
    company: "DataFlow Analytics",
    location: "Remote",
    remote: true,
    type: "FULL_TIME",
    salary: "Rp 20–30M/mo",
    description:
      "Help us unlock insights from massive datasets. You'll build ML models, perform statistical analysis, and communicate findings to stakeholders. Python, SQL, and experience with ML frameworks required.",
    tags: "Python, Machine Learning, Data Science, Remote",
    slug: "data-scientist-dataflow-analytics",
    published: false, // Draft
    applyUrl: null,
    expiresAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Expired 5 days ago
  },
];

async function main() {
  // Seed candidates
  for (const c of candidates) {
    await prisma.user.upsert({
      where: { email: c.email },
      update: c,
      create: c,
    });
  }
  console.log("Seeded 5 candidates.");

  // Seed jobs
  for (const job of jobs) {
    await prisma.job.upsert({
      where: { slug: job.slug },
      update: job,
      create: job,
    });
  }
  console.log("Seeded 4 jobs.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
