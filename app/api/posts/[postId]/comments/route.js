import User from "../../../../../models/User";
import Post from "../../../../../models/Post";
import Comment from "../../../../../models/Comment";
import connectToDB from "../../../../../utils/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../config/authOptions";
import { NextResponse } from "next/server";

// post a comment on a post
export async function POST(req, context) {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const { content } = await req.json();
  const userId = session.user.userId;
  const postId = context.params.postId;
  try {
    const currentUser = await User.findById(userId);
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const comment = new Comment({
      content,
      user: currentUser._id,
      post: post._id,
    });
    await comment.save();
    post.comments.push(comment);
    await post.save();
    return NextResponse.json({ post, comment }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 502 });
  }
}
