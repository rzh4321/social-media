import HomeFeed from "../../../components/HomeFeed";
import connectToDB from "../../../utils/database";
import Post from "../../../models/Post";
import Comment from "../../../models/Comment";
import User from "../../../models/User";
import Like from "../../../models/Like";
import Image from "../../../models/Image";

async function getPosts() {
  await connectToDB();
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

export default async function Home() {
  const posts = await getPosts();
  return (
    <>
      <HomeFeed feedType={"all"} postsData={JSON.stringify(posts)} />
    </>
  );
}
