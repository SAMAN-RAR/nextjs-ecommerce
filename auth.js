import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/db/db";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials;

        const admin = await db.admin.findUnique({ where: { username } });
        let result = {
          usernameInvalid: false,
          passwordInvalid: false,
        };
        if (!admin) return (result.usernameInvalid = "Admin not found");

        const isPasswordValid = bcrypt.compareSync(password, admin.password);

        if (!isPasswordValid)
          return (result.passwordInvalid = "The entered password is incorrect");

        return {
          id: admin.id,
          username: admin.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/auth", // لاگین کاستوم
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    async jwt({ token, user }) {
      // موقع لاگین فقط یک بار اجرا میشه
      if (user) {
        token.id = user.id; // AdminId
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      // این مقادیر توی useSession() در کل پروژه قابل دسترسن
      if (token) {
        session.user.id = token.id; // AdminId
        session.user.username = token.username;
      }
      return session;
    },
  },
});
