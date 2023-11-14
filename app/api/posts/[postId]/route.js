import connectToDB from "../../../../utils/database";
import Post from "../../../../models/Post";
import User from "../../../../models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../config/authOptions";

export async function DELETE(req, context) {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const userId = session.user.userId;
  const postId = context.params.postId;
  try {
    const currentUser = await User.findById(userId);
    await Post.deleteOne({ _id: postId });
    // delete from posts array
    currentUser.posts.splice(
      currentUser.posts.findIndex((id) => id === postId),
      1,
    );
    await currentUser.save();
    return NextResponse.json({ status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 404 });
  }
}
