"use client";

import { signOut, useSession } from "next-auth/react";


export default function Home() {
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  }

  return <>home
  <button onClick={handleLogout}>log out</button></>;
}
