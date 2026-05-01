export async function computeAdminToken(): Promise<string> {
  const secret = process.env.NEXTAUTH_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  if (!secret || !password) return "";
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(password));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isAdminAuthorized(): Promise<boolean> {
  const { auth } = await import("@/lib/auth");
  const { cookies } = await import("next/headers");

  const session = await auth();
  if (session?.user.isAdmin) return true;

  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;
  if (!adminToken) return false;

  const expected = await computeAdminToken();
  return adminToken === expected;
}
