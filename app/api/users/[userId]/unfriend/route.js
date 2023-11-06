import connectToDB from "../../../../../utils/database";
import User from "../../../../../models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function DELETE(req, context) {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const userId = session.user.userId;
  const friendId = context.params.userId;

  try {
    const friend = await User.findById(friendId);
    if (!friend) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user = await User.findById(userId);
    user.friends.splice(user.friends.indexOf(friend._id, 1));
    await user.save();
    friend.friends.splice(friend.friends.indexOf(user._id, 1));
    await friend.save();
    return NextResponse.json(
      { message: "unfriend successful", user, friend },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 502 });
  }
}
