"use server";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { isAdminAuthorized } from "@/lib/admin-token";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveJob(data: FormData, id?: string) {
  if (!(await isAdminAuthorized())) return { message: "Unauthorized" };

  const title = data.get("title") as string;
  const company = data.get("company") as string;
  const location = data.get("location") as string;
  const salary = data.get("salary") as string;
  const type = data.get("type") as string;
  const remote = data.get("remote") === "on";
  const published = data.get("published") === "on";
  const description = data.get("description") as string;
  const tags = data.get("tags") as string;
  const applyUrl = (data.get("applyUrl") as string) || null;
  const expiresAtStr = data.get("expiresAt") as string;
  const slug = slugify(`${title}-${company}`);

  let expiresAt: Date | null;
  if (id) {
    // On update: use provided date if any, else keep current
    expiresAt = expiresAtStr ? new Date(expiresAtStr) : undefined;
  } else {
    // On create: use provided date or default to 30 days from now
    expiresAt = expiresAtStr ? new Date(expiresAtStr) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  if (id) {
    const updateData: Record<string, any> = { title, company, location, salary: salary || null, type: type as never, remote, published, description, tags, applyUrl };
    if (expiresAt !== undefined) {
      updateData.expiresAt = expiresAt;
    }
    await prisma.job.update({
      where: { id },
      data: updateData,
    });
  } else {
    await prisma.job.create({
      data: { title, company, location, salary: salary || null, type: type as never, remote, published, description, tags, slug, applyUrl, expiresAt },
    });
  }

  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  redirect("/admin/jobs");
}
