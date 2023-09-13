import User from "../../../../../models/User";
import Image from "../../../../../models/Image";
import Post from "../../../../../models/Post";
import connectToDB from "../../../../../utils/database";
import { NextResponse } from "next/server";

// get user's posts
export async function GET(req, context) {
  await connectToDB();
  console.log("getting all session users posts");
  const userId = context.params.userId;
  // console.log('userid is ', userId);

  const currentUser = await User.findById(userId);
  const { searchParams } = new URL(req.url);
  const startId = searchParams.get("startId");
  if (startId) {
    try {
      const posts = await Post.find({ user: currentUser._id })
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
      // console.log("next 10 posts is ", posts);
      return NextResponse.json({ posts });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: err }, { status: 502 });
    }
  } else {
    //console.log("this is first call (initial page load)");
    // this is first call to get posts (initial page load)
    try {
      const posts = await Post.find({ user: currentUser._id })
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
