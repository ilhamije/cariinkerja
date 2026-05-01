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
  const slug = slugify(`${title}-${company}`);

  if (id) {
    await prisma.job.update({
      where: { id },
      data: { title, company, location, salary: salary || null, type: type as never, remote, published, description, tags },
    });
  } else {
    await prisma.job.create({
      data: { title, company, location, salary: salary || null, type: type as never, remote, published, description, tags, slug },
    });
  }

  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  redirect("/admin/jobs");
}
