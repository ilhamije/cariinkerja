"use server";

import { prisma } from "@/lib/prisma";
import { sendNewCandidateAlert } from "@/lib/email";

export async function onNewUserSignup(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;
  await sendNewCandidateAlert({ name: user.name, email: user.email });
}
