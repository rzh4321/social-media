import User from "../../../../models/User";
import { NextResponse } from "next/server";
import connectToDB from "../../../../utils/database";

import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectToDB();
  const reqData = await req.json();
  try {
    const user = await User.findOne({ username: reqData.username });
    if (user) {
      return NextResponse.json(
        {
          errors: ["Username already taken"],
          input: reqData,
        },
        { status: 400 },
      );
    }
    // username available, save user to db
    const hashedPassword = bcrypt.hashSync(reqData.password, 10);
    try {
      const user = new User({
        name: reqData.name,
        username: reqData.username,
        password: hashedPassword,
      });
      await user.save();
      return NextResponse.json({ user }, { status: 201 });
    } catch (err) {
      return NextResponse.json(
        { errors: ["Unknown server error"], input: reqData },
        { status: 400 },
      );
    }
  } catch (e) {
    return NextResponse.json(
      { errors: ["Unknown server error"], input: reqData },
      { status: 400 },
    );
  }
}
