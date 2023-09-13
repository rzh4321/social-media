import Like from "../../../../../../models/Like";
import Post from "../../../../../../models/Post";
import connectToDB from "../../../../../../utils/database";
import { NextResponse } from "next/server";

// user unlikes a post
export async function DELETE(req, context) {
  await connectToDB();
  console.log("inside api cancel like call");
  const likeId = context.params.likeId;
  const postId = context.params.postId;
  try {
    const like = await Like.findById(likeId);
    const post = await Post.findById(postId);
    if (!post) {
      console.log("cant find post for some reasn");
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    post.likes.pull(like._id);
    await post.save();
    console.log("cancelled like success");
    return NextResponse.json(
      { message: "Cancelled like", post },
      { status: 201 },
    );
  } catch (err) {
    console.log("error cancelling like: ", err);
    return NextResponse.json({ error: err }, { status: 502 });
  }
}
