import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import dbConnect from "@/lib/mongoose"
import User from "@/models/User"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await dbConnect();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
            });
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
                // @ts-ignore
                session.user.id = dbUser._id.toString();
                // @ts-ignore
                session.user.hasCompletedOnboarding = !!dbUser.bmi; // simple check
            }
        }
        return session;
    }
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
