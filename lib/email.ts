import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const FROM = `CariinKerja <${process.env.EMAIL_USER}>`;
const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim());

export async function sendNewCandidateAlert(candidate: { name: string | null; email: string }) {
  await transport.sendMail({
    from: FROM,
    to: adminEmails,
    subject: `New candidate to review: ${candidate.name ?? candidate.email}`,
    html: `<p>A new candidate <strong>${candidate.name ?? candidate.email}</strong> has signed up and is waiting for review.</p>
           <p><a href="${process.env.NEXTAUTH_URL}/admin/candidates">Review candidates →</a></p>`,
  });
}

export async function sendProfileActivated(to: string, name: string | null) {
  await transport.sendMail({
    from: FROM,
    to,
    subject: "You're in! We'll notify you of job matches",
    html: `<p>Hi ${name ?? "there"},</p>
           <p>Your profile has been reviewed and activated. We'll send you an email whenever we find a job that matches your profile.</p>
           <p><a href="${process.env.NEXTAUTH_URL}/dashboard">View your dashboard →</a></p>`,
  });
}

export async function sendJobMatch(
  to: string,
  name: string | null,
  job: { title: string; company: string; slug: string },
  note?: string | null
) {
  await transport.sendMail({
    from: FROM,
    to,
    subject: `We found a job for you: ${job.title} at ${job.company}`,
    html: `<p>Hi ${name ?? "there"},</p>
           <p>We think you'd be a great fit for <strong>${job.title}</strong> at <strong>${job.company}</strong>.</p>
           ${note ? `<p><em>${note}</em></p>` : ""}
           <p><a href="${process.env.NEXTAUTH_URL}/jobs/${job.slug}">View job →</a></p>`,
  });
}
