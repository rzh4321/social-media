import { NextResponse } from "next/server";
import { authOptions } from "./config/authOptions";
import { withAuth } from 'next-auth/middleware';

export default withAuth(authOptions);

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/:path*",
};
