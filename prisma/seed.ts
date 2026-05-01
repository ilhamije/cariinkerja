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

async function main() {
  for (const c of candidates) {
    await prisma.user.upsert({
      where: { email: c.email },
      update: c,
      create: c,
    });
  }
  console.log("Seeded 5 candidates.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
