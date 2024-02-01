import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: '/',
    signOut: '/',
  },
});

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};
