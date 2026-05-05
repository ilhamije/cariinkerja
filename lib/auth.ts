import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import { sendNewCandidateAlert } from "@/lib/email";

const devProvider =
  process.env.NODE_ENV !== "production"
    ? [
        Credentials({
          id: "dev",
          credentials: { email: {} },
          async authorize(credentials) {
            const email = credentials?.email as string;
            if (!email) return null;
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) return null;
            return { id: user.id, email: user.email, name: user.name, image: user.image };
          },
        }),
      ]
    : [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [...authConfig.providers, ...devProvider],
  events: {
    async createUser({ user }) {
      if (user.email) {
        await sendNewCandidateAlert({ name: user.name ?? null, email: user.email });
      }
    },
  },
});
