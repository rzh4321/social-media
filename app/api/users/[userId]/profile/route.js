import { z } from "zod";
import connectToDB from "../../../../../utils/database";
import User from "../../../../../models/User";
import { NextResponse } from "next/server";
import { url } from "inspector";

const nameSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .transform((val) => val.trim()),
});

const urlSchema = z.object({
  profilePicUrl: z
    .string()
    .min(1, { message: "URL is invalid" })
    .transform((val) => val.trim()),
});

const schema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .transform((val) => val.trim()),
  profilePicUrl: z
    .string()
    .min(1, { message: "URL is invalid" })
    .transform((val) => val.trim()),
});

export async function PUT(req, context) {
  await connectToDB();
  console.log("insde editing profile api handler");
  const { name, profilePicUrl } = await req.json();
  const userId = context.params.userId;

  try {
    if (profilePicUrl.trim().length > 0 && name.trim().length > 0) {
      try {
        const data = schema.parse({ name, profilePicUrl });
      } catch (err) {
        console.log("error form validation: ", err);
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      const user = await User.findByIdAndUpdate(userId, {
        name,
        profilePicUrl,
      });
    } else if (profilePicUrl.trim().length > 0) {
      try {
        const data = urlSchema.parse({ profilePicUrl });
      } catch (err) {
        console.log("error form validation: ", err);
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      const user = await User.findByIdAndUpdate(userId, {
        profilePicUrl,
      });
    } else {
      try {
        const data = nameSchema.parse({ name });
      } catch (err) {
        console.log("error form validation: ", err);
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      const user = await User.findByIdAndUpdate(userId, {
        name,
      });
    }
    return NextResponse.json({ message: "Updated profile" }, { status: 200 });
  } catch (err) {
    console.log("error updating profile: ", err);
    return NextResponse.json({ error: err }, { status: 502 });
  }
}
