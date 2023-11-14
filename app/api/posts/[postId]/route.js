import connectToDB from "../../../../utils/database";
import Post from "../../../../models/Post";
import User from "../../../../models/User";
import Comment from "../../../../models/Comment";
import Like from "../../../../models/Like";
import Image from "../../../../models/Image";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../config/authOptions";

export async function DELETE(req, context) {
  console.log('in delete')
  await connectToDB();
  const session = await getServerSession(authOptions);
  const userId = session.user.userId;
  const postId = context.params.postId;
  try {
    const currentUser = await User.findById(userId);
    const deletePost = await Post.findById(postId);
    const imageId = deletePost.image;
    console.log('image id is ', imageId);
    if (imageId) {
      console.log('theres an image');
      await Image.deleteOne({ _id: imageId});
    }
    await Post.deleteOne({ _id : postId });
    // delete from posts array
    currentUser.posts.splice(
      currentUser.posts.findIndex((id) => id === postId),
      1,
    );
    // delete all associated likes and comments
    await Comment.deleteMany({ post: postId });
    await Like.deleteMany({ post: postId });
    await currentUser.save();
    return NextResponse.json({ status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 404 });
  }
}
