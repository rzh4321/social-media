"use client";

import HomeFeed from "../../../components/HomeFeed";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  return (
    <>
      <HomeFeed feedType={"home"} />
    </>
  );
}
