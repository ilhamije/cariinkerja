import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";

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
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = (auth?.user as { isAdmin?: boolean })?.isAdmin === true;
      const path = nextUrl.pathname;

      if (path.startsWith("/admin")) return isAdmin;
      if (path.startsWith("/dashboard") || path.startsWith("/profile")) return isLoggedIn;
      return true;
    },
  },
  pages: { signIn: "/subscribe" },
};
