import connectToDB from "../../../../../utils/database";
import User from "../../../../../models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(req, context) {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const userId = session.user.userId;
  const friendId = context.params.friendId;

  try {
    const friend = await User.findById(friendId);
    if (!friend) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user = await User.findById(userId);
    user.friendRequestsReceived.splice(
      user.friendRequestsReceived.indexOf(friend._id, 1),
    );
    await user.save();
    friend.friendRequestsSent.splice(
      friend.friendRequestsSent.indexOf(user._id, 1),
    );
    await friend.save();
    return NextResponse.json(
      { message: "friend request declined", user, friend },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 502 });
  }
}
