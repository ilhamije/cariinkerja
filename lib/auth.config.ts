import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";
import { computeAdminToken } from "@/lib/admin-token";
import { prisma } from "@/lib/prisma";

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
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          linkedinUrl: (profile as any).public_profile_url || (profile as any).profile_url,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account?.provider === "linkedin" && user?.email) {
        const linkedinUrl = (profile as any)?.public_profile_url || (profile as any)?.profile_url;
        if (linkedinUrl) {
          token.linkedinUrl = linkedinUrl;
          // Update user with LinkedIn URL
          await prisma.user.update({
            where: { email: user.email },
            data: { linkedinUrl },
          }).catch(() => {
            // Silently fail if user doesn't exist yet
          });
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.isAdmin = adminEmails.includes(session.user.email ?? "");
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
