import { NextAuthOptions, getServerSession } from "next-auth";
import { db } from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { nanoid } from "nanoid";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      // check if a user already exists
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      // if a user does not exist
      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      // if there is no username
      if (!dbUser.username) {
        // update their username
        await db.user.update({
          where: { id: dbUser.id },
          // generate randome username using nanoid
          data: { username: nanoid(10) },
        });
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      };
    },
    redirect() {
      // redirect to homepage after logging in
      return "/";
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
