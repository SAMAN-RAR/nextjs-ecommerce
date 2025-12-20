import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "./db/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const { email } = credentials;

        const existingUser = await db.user.findUnique({ where: { email } });

        if (existingUser) {
          return {
            email,
            id: existingUser.id,
          };
        } else {
          const newUser = await db.user.create({
            data: { email },
          });

          return {
            email,
            id: newUser.id,
          };
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
});
