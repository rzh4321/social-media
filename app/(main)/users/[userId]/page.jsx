import ProfileSection from "../../../../components/ProfileSection";
import HomeFeed from "../../../../components/HomeFeed";
import User from "../../../../models/User";
import Like from "../../../../models/Like";
import Comment from "../../../../models/Comment";
import connectToDB from "../../../../utils/database";
import Post from "../../../../models/Post";

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

export default async function UserPage({ params }) {
  await connectToDB();
  const user = await getUser(params.userId);
  const posts = await getPosts(params.userId);
  return (
    <div className="mt-4">
      <ProfileSection stringData={JSON.stringify(user)} edit={false} />
      <HomeFeed
        feedType={"user"}
        postsData={JSON.stringify(posts)}
        authuserData={JSON.stringify(user)}
      />
    </div>
  );
}
