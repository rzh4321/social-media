import User from "../../../../models/User";
import { NextResponse } from "next/server";
import connectToDB from "../../../../utils/database";

// check if user already exists. Otherwise create one
export async function POST(req) {
  await connectToDB();
  const { username, name, profilePicUrl } = await req.json(); // username will be their email
  const user = await User.findOne({ username: username });
  if (user) {
    return NextResponse.json({
      message: "Logged in",
      user,
    });
  }
  try {
    // no need for password if signing in with provider
    const user = new User({
      name: name,
      username: username,
      profilePicUrl: profilePicUrl,
    });
    await user.save();
    return NextResponse.json({ message: "Logged in", user }, { status: 201 });
  } catch (err) {
    throw new Error("couldnt create and save user to db for some reaosn");
  }
}
