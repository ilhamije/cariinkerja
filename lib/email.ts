import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.RESEND_FROM || "onboarding@resend.dev";
const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim());

export async function sendNewCandidateAlert(candidate: { name: string | null; email: string }) {
  if (!resend) {
    console.log("[email] New candidate to review:", candidate.name ?? candidate.email, `<${candidate.email}>`);
    return;
  }
  try {
    await resend.emails.send({
      from: FROM,
      to: adminEmails,
      subject: `New candidate to review: ${candidate.name ?? candidate.email}`,
      html: `<p>A new candidate <strong>${candidate.name ?? candidate.email}</strong> has signed up and is waiting for review.</p><p><a href="${process.env.NEXTAUTH_URL}/admin/candidates">Review candidates →</a></p>`,
    });
  } catch (error) {
    console.error("[email] Failed to send new candidate alert:", error);
  }
}

export async function sendProfileActivated(to: string, name: string | null) {
  if (!resend) {
    console.log("[email] Profile activated →", name ?? "unknown", `<${to}>`);
    return;
  }
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: "You're in! We'll notify you of job matches",
      html: `<p>Hi ${name ?? "there"},</p><p>Your profile has been reviewed and activated. We'll send you an email whenever we find a job that matches your profile.</p><p><a href="${process.env.NEXTAUTH_URL}/dashboard">View your dashboard →</a></p>`,
    });
  } catch (error) {
    console.error("[email] Failed to send profile activated:", error);
  }
}

export async function sendJobMatch(
  to: string,
  name: string | null,
  job: { title: string; company: string; slug: string },
  note?: string | null
) {
  if (!resend) {
    console.log("[email] Job match →", name ?? "unknown", `<${to}>`, "|", job.title, "at", job.company, note ? `| note: ${note}` : "");
    return;
  }
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `We found a job for you: ${job.title} at ${job.company}`,
      html: `<p>Hi ${name ?? "there"},</p><p>We think you'd be a great fit for <strong>${job.title}</strong> at <strong>${job.company}</strong>.</p>${note ? `<p><em>${note}</em></p>` : ""}<p><a href="${process.env.NEXTAUTH_URL}/jobs/${job.slug}">View job →</a></p>`,
    });
  } catch (error) {
    console.error("[email] Failed to send job match:", error);
  }
}
