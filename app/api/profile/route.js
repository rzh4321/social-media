import { z } from "zod";
import connectToDB from "../../../utils/database";
import User from "../../../models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../config/authOptions";

const nameSchema = z.object({
  name: z.string().refine(value => {
    const trimmedValue = value.trim();
    return trimmedValue.length >= 1;
  }, { message: "Name is required" }),
}).transform(value => ({
  ...value,
  name: value.name.trim(),
}));

const urlSchema = z.object({
  profilePicUrl: z.string().refine(value => {
    const trimmedValue = value.trim();
    return trimmedValue.length >= 1;
  }, { message: "URL is invalid" }),
}).transform(value => ({
  ...value,
  profilePicUrl: value.profilePicUrl.trim()
}));

const schema = z.object({
  name: z.string().refine(value => {
    const trimmedValue = value.trim();
    return trimmedValue.length >= 1;
  }, { message: "Name is required" }),
  
  profilePicUrl: z.string().refine(value => {
    const trimmedValue = value.trim();
    return trimmedValue.length >= 1;
  }, { message: "URL is invalid" }),
}).transform(value => ({
  ...value,
  name: value.name.trim(),
  profilePicUrl: value.profilePicUrl.trim()
}));

export async function PUT(req) {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const data = await req.formData();
  const arr = Array.from(data.entries());
  const userId = session.user.userId;

  try {
    // updated name and pic with URL
    if (arr[0][1].trim().length > 0 && arr[1][1].trim().length > 0) {
      try {
        const data = schema.parse({
          name: arr[0][1],
          profilePicUrl: arr[1][1],
        });
      } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      const user = await User.findByIdAndUpdate(userId, {
        name: arr[0][1],
        profilePicUrl: arr[1][1],
      });
      // only updated pic with URL
    } else if (arr[1][1].trim().length > 0) {
      try {
        const data = urlSchema.parse({ profilePicUrl: arr[1][1] });
      } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      const user = await User.findByIdAndUpdate(userId, {
        profilePicUrl: arr[1][1],
      });
      // updated name
    } else if (arr[0][1].trim().length > 0) {
      try {
        const data = nameSchema.parse({ name: arr[0][1] });
      } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      // also updated pic with upload
      if (arr.length > 2) {
        const arrayBuffer = await arr[2][1].arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const url = `data:${arr[2][1].type};base64,${buffer.toString(
          "base64",
        )}`;
        const user = await User.findByIdAndUpdate(userId, {
          name: arr[0][1],
          profilePicUrl: url,
        });
      } else {
        const user = await User.findByIdAndUpdate(userId, {
          name: arr[0][1],
        });
      }
    }
    // only updated pic with uplaod
    else {
      const arrayBuffer = await arr[2][1].arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const url = `data:${arr[2][1].type};base64,${buffer.toString("base64")}`;
      const user = await User.findByIdAndUpdate(userId, {
        profilePicUrl: url,
      });
    }
    return NextResponse.json({ message: "Updated profile" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 502 });
  }
}
