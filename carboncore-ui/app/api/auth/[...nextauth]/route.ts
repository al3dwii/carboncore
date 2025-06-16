import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Email from "next-auth/providers/email";
import { JWT } from "next-auth/jwt";

const handler = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    }),
    Email({ server: process.env.EMAIL_SERVER!, from: "auth@carboncore.io" })
  ],
  callbacks: {
    /**
     * Attach CarbonCore role claim.
     * TODO: Replace stub with real backend call.
     */
    async jwt({ token }: { token: JWT }) {
      token.role = "developer"; // stub role
      return token;
    },
    async session({ session, token }) {
      // put role onto session object
      (session as any).user.role = token.role;
      return session;
    }
  }
});

export { handler as GET, handler as POST };
