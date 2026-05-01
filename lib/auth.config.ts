import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";
import { computeAdminToken } from "@/lib/admin-token";

const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim());

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = (user as { id: string }).id;
        session.user.isAdmin = adminEmails.includes(user.email ?? "");
      }
      return session;
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = (auth?.user as { isAdmin?: boolean })?.isAdmin === true;
      const path = request.nextUrl.pathname;

      if (path.startsWith("/admin")) {
        if (path === "/admin/login") return true;
        if (isAdmin) return true;
        const adminToken = request.cookies.get("admin_token")?.value;
        if (adminToken) {
          const expected = await computeAdminToken();
          if (adminToken === expected) return true;
        }
        return Response.redirect(new URL("/admin/login", request.nextUrl));
      }
      if (path.startsWith("/dashboard") || path.startsWith("/profile")) return isLoggedIn;
      return true;
    },
  },
  pages: { signIn: "/subscribe" },
};
