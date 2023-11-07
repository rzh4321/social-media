import Like from "../../../../../../models/Like";
import Post from "../../../../../../models/Post";
import connectToDB from "../../../../../../utils/database";
import { NextResponse } from "next/server";

// user unlikes a post
export async function DELETE(req, context) {
  await connectToDB();
  const likeId = context.params.likeId;
  const postId = context.params.postId;
  try {
    const like = await Like.findById(likeId);
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    post.likes.pull(like._id);
    await post.save();
    return NextResponse.json(
      { message: "Cancelled like", post },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 502 });
  }
}
