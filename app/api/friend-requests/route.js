import connectToDB from "../../../utils/database";
import User from "../../../models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../config/authOptions";

// send friend request
export async function POST(req) {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const { friendId } = await req.json();
  const userId = session.user.userId;

  try {
    const friend = await User.findById(friendId);
    if (!friend) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user = await User.findById(userId);
    user.friendRequestsSent.push(friend._id);
    await user.save();
    friend.friendRequestsReceived.push(user._id);
    await friend.save();
    return NextResponse.json(
      { message: "friend request sent", user, friend },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 502 });
  }
}
