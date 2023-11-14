import User from "../../../models/User";
import Post from "../../../models/Post";
import Comment from "../../../models/Comment";
import Like from "../../../models/Like";
import Image from "../../../models/Image";
import { authOptions } from "../../../config/authOptions";
import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";
import connectToDB from "../../../utils/database";

// gets ALL posts
export async function GET(req) {
  await connectToDB();
  const { searchParams } = new URL(req.url);
  const startId = searchParams.get("startId");
  if (startId) {
    try {
      const posts = await Post.find()
        .where("_id")
        .lt(startId)
        .sort({ _id: -1 })
        .limit(10)
        .populate("user")
        .populate({
          path: "likes",
          populate: {
            path: "user",
          },
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        });
      return NextResponse.json({ posts });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: err }, { status: 502 });
    }
  } else {
    try {
      const posts = await Post.find()
        .sort({ _id: -1 })
        .limit(10)
        .populate("user")
        .populate({
          path: "likes",
          populate: {
            path: "user",
          },
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        });
      return NextResponse.json({ posts });
    } catch (err) {
      return NextResponse.json({ error: err }, { status: 502 });
    }
  }
}

// session user makes a post
export async function POST(req, context) {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const data = await req.formData();
  const arr = Array.from(data.entries());
  const userId = session.user.userId;

  const currentUser = await User.findById(userId);

  try {
    let image;
    let post;
    if (arr.length > 1) {
      // theres an image
      // convert file object to buffer
      const arrayBuffer = await arr[1][1].arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      image = new Image({
        filename: arr[1][1].name,
        contentType: arr[1][1].type,
        data: buffer,
      });

      await image.save();

      post = new Post({
        content: arr[0][1],
        user: currentUser._id,
        image: image,
      });
    } else {
      // no image
      post = new Post({
        content: arr[0][1],
        user: currentUser._id,
      });
    }
    await post.save();
    currentUser.posts.push(post);
    await currentUser.save();
    // populate the new post before returning it since we'll call setPost() with it
    const populatedPost = await Post.findById(post._id)
      .populate("user")
      .populate({
        path: "likes",
        populate: {
          path: "user",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });
    return NextResponse.json({ post: populatedPost }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Unknown server error" },
      { status: 500 },
    );
  }
}
