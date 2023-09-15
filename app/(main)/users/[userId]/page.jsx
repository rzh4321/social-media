import ProfileSection from "../../../../components/ProfileSection";
import HomeFeed from "../../../../components/HomeFeed";
import User from "../../../../models/User";
import Post from "../../../../models/Post";
import { notFound } from "next/navigation";

async function findUser(userId) {
  const user = await User.findById(userId);
  if (!user) {
    notFound();
  }
  return user;
}

async function getPosts(userId) {
  try {
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
    console.log(err);
  }
}
export default async function UserPage({ params }) {
  const user = await findUser(params.userId);
  const posts = await getPosts(params.userId);
  return (
    <div className="mt-4">
      <ProfileSection stringData={JSON.stringify(user)} edit={false} />
      <HomeFeed feedType={"user"} postsData={JSON.stringify(posts)} />
    </div>
  );
}
