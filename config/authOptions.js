import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  pages: {
    signIn: '/',
    signOut: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      name: "credentials",
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "username", type: "text", placeholder: "username" },
        password: { label: "password", type: "password" },
      },
      // this will be called when we sign in with normal credentials
      async authorize(credentials, req) {
        const res = await fetch(`https://retiform.vercel.app/api/auth/login`, {
          method: "POST",
          body: JSON.stringify(credentials),
        });
        // should either return user retrieved from database, or error
        const data = await res.json();

        // If no error and we have user data, return it
        if (res.ok && data.user) {
          return data;
        }
        // Return null if user data could not be retrived
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Google login: finding an existing account or creating a new account
      // in the database with the provided name, username and profilePicUrl provided by google
      if (account.provider === "google") {
        // user object has details from google account, use those details to retrieve or create user object
        // in api call later
        const credentials = {
          name: user.name,
          username: user.email,
          profilePicUrl: user.image,
        };
        const res = await fetch(
          `https://retiform.vercel.app/api/auth/google-login`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          },
        );
        // user and token will be returned from api call
        const data = await res.json();
        // save id to user object so we can store it in session later
        user.id = data.user._id;
        // user.token = data.token;
        return true;
      } else if (account.provider === "credentials") {
        // we already have all the necessary data from authorize(), just return true
        return true;
      }
    },
    // transfer user data to token object
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        //token.accessToken = user.token;
        token.userId = user.id;
      } else if (account?.provider === "credentials") {
        token.userId = user.user._id;
      }
      return token;
    },
    // transfer token data to session object
    async session({ session, token }) {
      session.user.userId = token.userId;
      // session only stores userId
      return session;
    },
  },
};
