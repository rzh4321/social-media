import ProfileSection from "../../../components/ProfileSection";
import HomeFeed from "../../../components/HomeFeed";
import User from "../../../models/User";
import Post from "../../../models/Post";
import Like from "../../../models/Like";
import Comment from "../../../models/Comment";
import connectToDB from "../../../utils/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

async function findUser(userId) {
  // same thing in api route handler
  const user = await User.findById(userId).populate(
    "friends friendRequestsSent friendRequestsReceived",
  );
  return user;
}

async function getPosts(userId) {
  try {
    // same thing in api route handler
    const posts = await Post.find({ user: userId })
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
    //console.log("error fecthing users posts: ", err);
    throw new Error(err);
  }
}

export default async function ProfilePage({ params }) {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const user = await findUser(session.user.userId);
  const posts = await getPosts(session.user.userId);

  return (
    <div className="mt-4">
      <ProfileSection stringData={JSON.stringify(user)} edit={true} />
      <HomeFeed feedType={"profile"} postsData={JSON.stringify(posts)} />
    </div>
  );
}
