"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { computeAdminToken } from "@/lib/admin-token";

export async function adminLogin(_: unknown, formData: FormData) {
  const password = formData.get("password") as string;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return { error: "Invalid password" };
  }
  const token = await computeAdminToken();
  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  redirect("/admin");
}
