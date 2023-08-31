import User from "../../../../../models/User";
import Post from "../../../../../models/Post";

import { NextResponse } from "next/server";
import connectToDB from "../../../../../utils/database";

// gets session user's posts
export async function GET(req) {
  await connectToDB();
  console.log("getting all posts");
  // console.log('userid is ', userId);
  const { searchParams } = new URL(req.url);
  const startId = searchParams.get("startId");
  console.log("search params of startId (if u included) is ", startId);
  if (startId) {
    try {
      const posts = await Post.find()
        .where("_id")
        .lt(startId)
        .sort({ _id: -1 })
        .limit(10)
        .populate("user")
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        });
      console.log("next 10 posts is ", posts);
      return NextResponse.json({ posts });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: err }, { status: 502 });
    }
  } else {
    console.log("this is first call (initial page load)");
    // this is first call to get posts (initial page load)
    try {
      const posts = await Post.find()
        .sort({ _id: -1 })
        .limit(10)
        .populate("user")
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        });
      console.log("first 10 posts is ", posts);
      return NextResponse.json({ posts });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: err }, { status: 502 });
    }
  }
}
