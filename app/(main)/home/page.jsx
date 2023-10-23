import HomeFeed from "../../../components/HomeFeed";
import User from "../../../models/User";
import Post from "../../../models/Post";
import Comment from "../../../models/Comment";
import Like from "../../../models/Like";
import connectToDB from "../../../utils/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

async function getPosts(userId) {
  const currentUser = await User.findById(userId);
  // this is how we check what to show on feed
  const usersIds = [currentUser._id, ...currentUser.friends];
  try {
    const posts = await Post.find({ user: { $in: usersIds } })
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
    throw new Error(err);
  }
}

async function getUser(userId) {
  try {
    const user = await User.findById(userId).populate(
      "friends friendRequestsSent friendRequestsReceived",
    );
    if (!user) {
      throw new Error("cant find user");
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
  const posts = await getPosts(session.user.userId);
  return (
    <>
      <HomeFeed
        feedType={"home"}
        postsData={JSON.stringify(posts)}
        authuserData={JSON.stringify(user)}
      />
    </>
  );
}
