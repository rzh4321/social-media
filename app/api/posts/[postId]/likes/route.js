import User from "../../../../../models/User";
import Post from "../../../../../models/Post";
import Like from "../../../../../models/Like";
import connectToDB from "../../../../../utils/database";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import mongoose from "mongoose";

// user gives a like to a post
export async function POST(req, context) {
  await connectToDB();
  const session = await getServerSession(authOptions);
  console.log("inside api like post call");
  const userId = session.user.userId;
  const postId = context.params.postId;
  const user = await User.findById(userId);
  const post = await Post.findById(postId);
  if (!post) {
    console.log("cant find post for some reasn");
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  //console.log('userid is ', userId, ' postid is ', postId);
  try {
    const like = new Like({
      user: new mongoose.Types.ObjectId(user._id),
      post: new mongoose.Types.ObjectId(post._id),
    });
    await like.save();
    post.likes.push(like);
    await post.save();
    console.log("liked post success");
    return NextResponse.json(
      { message: "Liked post", post, like },
      { status: 201 },
    );
  } catch (err) {
    console.log("error liking post: ", err);
    return NextResponse.json({ error: err }, { status: 502 });
  }
}
