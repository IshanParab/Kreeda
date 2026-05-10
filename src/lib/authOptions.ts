import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { isAdminEmail } from "@/lib/admin";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();
        const isAdmin = isAdminEmail(user.email);
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              isAdmin,
            });
          } else if (existingUser.isAdmin !== isAdmin) {
            existingUser.isAdmin = isAdmin;
            await existingUser.save();
          }
          return true;
        } catch (error) {
          console.error("Error checking/creating user during sign in:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      await dbConnect();
      if (session.user?.email) {
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
          session.user.id = dbUser._id.toString();
          session.user.hasCompletedOnboarding = !!dbUser.bmi;
          session.user.isAdmin = !!dbUser.isAdmin;
        }
      }
      return session;
    },
  },
};
