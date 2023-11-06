import User from "../../../../models/User";
import { NextResponse } from "next/server";
import connectToDB from "../../../../utils/database";

import bcrypt from "bcryptjs";

async function authenticate(username, password) {
  const regex = new RegExp(username, "i");
  const user = await User.findOne({ username: { $regex: regex } });
  if (!user) {
    return { status: false, message: "Username does not exist" };
  }
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    // passwords do not match
    return { status: false, message: "Incorrect password" };
  }
  return { status: true, user };
}

// checks if user exists and pw matches. If yes, return user object and token. Otherwise return error
export async function POST(req) {
  await connectToDB();
  const { username, password } = await req.json();

  const authRes = await authenticate(username, password);

  if (authRes.status) {
    return NextResponse.json({
      message: "Logged in",
      user: authRes.user,
    });
  } else {
    return NextResponse.json({ message: authRes.message }, { status: 400 });
  }
}
