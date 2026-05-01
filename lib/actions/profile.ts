"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: FormData) {
  const session = await auth();
  if (!session) return { message: "Unauthorized" };

  const name = data.get("name") as string;
  const linkedinUrl = data.get("linkedinUrl") as string;
  const roles = data.get("roles") as string;
  const locations = data.get("locations") as string;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name || undefined,
      linkedinUrl: linkedinUrl || undefined,
      preferences: JSON.stringify({ roles, locations }),
    },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { message: "Profile saved." };
}
