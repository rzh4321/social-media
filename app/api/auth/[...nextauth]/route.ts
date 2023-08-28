import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";

if (!process.env.GOOGLE_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Google credentials not found in environment variables");
  }

const handler = NextAuth({
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
          const res = await fetch(`/app/api/auth/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' },
          });
          const data = await res.json();
  
          // If no error and we have user data, return it
          if (res.ok && data.user) {
            return data;
          }
          // Return null if user data could not be retrived
          return null
        }
      })
    ],
    session: {
        strategy: 'jwt'
    }, 
    callbacks: {
        async signIn({ user, account } : any) : Promise<any> {
          // Google login: finding an existing account or creating a new account
          // in the database with the provided name, username and profilePicUrl from google
          if (account.provider === 'google') {
            const credentials = {
              name: user.name,
              username: user.email,
              profilePicUrl: user.image
            };
            console.log('u just signed in with google. this is user object: ', user);
            const res = await fetch(`/app/api/auth/google-login`, {
              method: 'POST',
              body: JSON.stringify(credentials),
              headers: { 'Content-Type': 'application/json' },
            });
            // user and token will be returned from api call
            const data = await res.json();
            user.id = data.user.id;
            user.token = data.token;
            console.log('after api call to google to get User db object and token, we updated user object id and token. now its ', user);
            return true;
          } else if (account.provider === 'credentials') {
            return true;
          }
        },
        async jwt({ token, user, account } : any) {
            console.log('INSIDE JWT FUNCTION')
          console.log('token jwt', token);
          console.log('user jwt', user);
          console.log('account jwt', account);
          if (account?.provider === 'google') {
            token.accessToken = user.token;
            token.userId = user.id;
            token.userName = user.name;
            token.userEmail = user.email;
            token.userImage = user.image;
            console.log('u signed in with google. token is now ', token);
          } else if (account?.provider === 'credentials') {
            token.accessToken = user.token;
            token.userId = user.user._id;
            token.userName = user.user.name;
            token.userEmail = user.user.username;
            token.userImage = user.user.profile_pic_url;
            console.log('u signed in with credentials. token is now ', token);

          }
          return token;
        },
        async session({ session, token } : any) {
            console.log('IN SESSION FUNCTION');
            console.log('session is ', session);
            console.log('(is this the same token as in jwt?) token is ', token);
          session.accessToken = token.accessToken;
          session.user.userId = token.userId;
          session.user.name = token.userName;
          session.user.email = token.userEmail;
          session.user.image = token.userImage;
          console.log('updated session. it is now ', session);
          return session;
        }
      },
  })
  
  export { handler as GET, handler as POST }