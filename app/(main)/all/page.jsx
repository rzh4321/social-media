import HomeFeed from "../../../components/HomeFeed";
import connectToDB from "../../../utils/database";
import Post from "../../../models/Post";
import Comment from "../../../models/Comment";
import User from "../../../models/User";
import Like from "../../../models/Like";
import Image from "../../../models/Image";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { connect } from "http2";

async function getPosts() {
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
      return posts;
    } catch (err) {
      console.log(err);
    }
}

async function getUser(userId) {

  try {
    const user = await User.findById(userId).populate(
      "friends friendRequestsSent friendRequestsReceived",
    );
    if (!user) {
      throw new Error('cant find user');
    }
    return user;
  } catch (e) {
    console.log("error occurred when trying to get user data: ", e);
    throw new Error(e);
  }
}

export default async function Home() {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const user = await getUser(session.user.userId);
  const posts = await getPosts();
  return (
    <>
      <HomeFeed feedType={"all"} postsData={JSON.stringify(posts)} authuserData={JSON.stringify(user)} />
    </>
  );
}
