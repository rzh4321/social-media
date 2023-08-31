import User from "../../../../../models/User";
import Post from "../../../../../models/Post";

import {promises as fsPromises} from 'fs';
import path from 'path';

import { NextResponse } from "next/server";
import connectToDB from "../../../../../utils/database";

// gets session user's posts
export async function GET(req) {
  await connectToDB();
  console.log("getting all session users posts");
  const pathParts = req.url.split("/");
  const userId = pathParts[pathParts.length - 1];
  // console.log('userid is ', userId);

  const currentUser = await User.findById(userId);
  const { searchParams } = new URL(req.url);
  const startId = searchParams.get("startId");
  console.log("search params of startId (if u included) is ", startId);
  if (startId) {
    try {
      const posts = await Post.find({ user: currentUser._id })
        .where("_id")
        .lt(startId)
        .sort({ _id: -1 })
        .limit(10)
        .populate("user")
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        });
      console.log("next 10 posts is ", posts);
      return NextResponse.json({ posts });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: err }, { status: 502 });
    }
  } else {
    console.log("this is first call (initial page load)");
    // this is first call to get posts (initial page load)
    try {
      const posts = await Post.find({ user: currentUser._id })
        .sort({ _id: -1 })
        .limit(10)
        .populate("user")
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        });
      console.log("first 10 posts is ", posts);
      return NextResponse.json({ posts });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: err }, { status: 502 });
    }
  }
}

// session user makes a post
export async function POST(req) {
  console.log('insde making a post api handler')
  // const data = await req.json();
  // console.log('data is ', data);
  console.log('req is ', req.body)
  // const test = await new Response(req.body).text();
  // console.log('req is ', test);
  // throw new Error('asd')
}