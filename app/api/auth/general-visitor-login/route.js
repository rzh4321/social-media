import User from "../../../../models/User";
import { NextResponse } from "next/server";
import connectToDB from "../../../../utils/database";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// function to generate random usernames
function generateRandomUsername() {
  const adjectives = ["happy", "lucky", "sunny", "clever", "bright", "vivid"];
  const nouns = ["cat", "dog", "rabbit", "bird", "tiger", "lion"];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * (1000 - 0 + 1) + 0);

  return `${randomAdjective}_${randomNoun}_${randomNumber}`;
}

export const GET = () => {
  return NextResponse.json({ message: "hi" });
};

// saves visitor data into db and returns user object
export const POST = async () => {
  await connectToDB();
  console.log("u pressed visitor");
  const username = generateRandomUsername();
  const hashedPassword = bcrypt.hashSync(username, 10);
  try {
    const user = new User({
      name: username,
      username: username,
      password: hashedPassword,
    });
    await user.save();
    //const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    return NextResponse.json({
      message: "logged in",
      user: user,
      //         token: token,
    });
  } catch (err) {
    throw new Error("cant hash password or create new user or something");
  }
};
