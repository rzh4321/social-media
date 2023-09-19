import ProfileSection from "../../../../components/ProfileSection";
import HomeFeed from "../../../../components/HomeFeed";
import User from "../../../../models/User";
import Post from "../../../../models/Post";

async function findUser(userId) {
  // dont cache. Otherwise, when we unfriend someone, it will still show as a friend since fetch response wont update
  // even after unfriend
  const res = await fetch(`https://social-media-eight-rho.vercel.app/api/users/${userId}`, {cache: 'no-store'});
  const data = await res.json();
return data.user;
}

async function getPosts(userId) {
  const res = await fetch(`http://localhost:3000/api/users/${userId}/posts`, {cache: 'no-store'});
  const data = await res.json();
  //console.log(data);
return data.posts;
}
export default async function UserPage({ params }) {
  const user = await findUser(params.userId);
  const posts = await getPosts(params.userId);
  //console.log(posts);
  return (
    <div className="mt-4">
      <ProfileSection stringData={JSON.stringify(user)} edit={false} />
      <HomeFeed feedType={"user"} postsData={JSON.stringify(posts)} />
    </div>
  );
}
