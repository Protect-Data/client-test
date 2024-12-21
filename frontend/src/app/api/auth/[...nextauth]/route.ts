import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { cookies } from "next/headers";
import { API_URL } from "@/utils/keys";

export const authOption: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "NEXTAUTH_SECRET",
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (credentials == null) return null;
        try {
          // login action
          const {
            data: signCredentials
          } = await axios.post(`${API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password
          });
          // set cookie
          cookies().set("protectdata.session", signCredentials.token);
          return {
            ...signCredentials.user,
            token: signCredentials.token
          };
        } catch (error) {
          console.log("[CredentialsProviderAuthorizeError]", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login"
  },
  callbacks: {
    async jwt({ token, user }: any) {
      user && (token.user = user);
      return token;
    },
    async session({ session, token }) {
      session = token.user as any;
      // register or login
      if (session) {
        const { data: user } = await axios.get(`${API_URL}/users/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: cookies().get("protectdata.session")
              ? `Bearer ${cookies().get("protectdata.session")?.value}`
              : ""
          }
        });
        return {...session, ...user};
      }
      return session;
    }
  }
};

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
