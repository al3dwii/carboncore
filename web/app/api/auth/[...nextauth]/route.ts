import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GH_ID || "",
      clientSecret: process.env.GH_SEC || "",
    }),
    Google({
      clientId: process.env.GG_ID || "",
      clientSecret: process.env.GG_SEC || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        const r = await fetch(`${process.env.API_URL}/tokens`, {
          headers: { Authorization: `Bearer ${account.access_token}` },
        });
        const { token: api } = await r.json();
        (token as any).api = api;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).api = (token as any).api;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
