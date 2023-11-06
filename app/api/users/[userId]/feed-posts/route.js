import User from "../../../../../models/User";
import Post from "../../../../../models/Post";
import Comment from "../../../../../models/Comment";
import Like from "../../../../../models/Like";

import { NextResponse } from "next/server";
import connectToDB from "../../../../../utils/database";

// gets user data given userId param
export async function GET(req, context) {
  await connectToDB();
  const userId = context.params.userId;

  const currentUser = await User.findById(userId);
  // this is how we check what to show on feed
  const usersIds = [currentUser._id, ...currentUser.friends];
  const { searchParams } = new URL(req.url);
  const startId = searchParams.get("startId");
  // get all posts in feed
  if (startId) {
    try {
      const posts = await Post.find({ user: { $in: usersIds } })
        .where("_id")
        .lt(startId)
        .sort({ _id: -1 })
        .limit(10)
        .populate("user")
        .populate({
          path: "likes",
          populate: {
            path: "user",
          },
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        });
      return NextResponse.json({ posts });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: err }, { status: 502 });
    }
  } else {
    // this is first call to get posts (initial page load)
    try {
      const posts = await Post.find({ user: { $in: usersIds } })
        .sort({ _id: -1 })
        .limit(10)
        .populate("user")
        .populate({
          path: "likes",
          populate: {
            path: "user",
          },
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        });
      return NextResponse.json({ posts });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: err }, { status: 502 });
    }
  }
}
