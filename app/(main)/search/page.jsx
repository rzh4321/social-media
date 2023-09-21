//import User from "../../../models/User";
import FriendsSection from "../../../components/FriendsSection";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
//import { getUsersFromFilter } from "../../../actions";    server action wont work in deploy

// using this wont work in deploy, cant work with database directly in server components for some reason
// async function getUsersFromFilter(filter, userId) {
//   const regex = new RegExp(`^${filter}`, "i"); // 'i' makes the search case-insensitive
//   const names = await User.find({ name: regex, _id: { $ne: userId } });
//   const usernames = await User.find({ username: regex, _id: { $ne: userId } });
//   const res = [...names];
//   const seenIds = new Set(names.map((obj) => obj._id.toString()));
//   // make sure there are no duplicate users
//   for (const obj of usernames) {
//     if (!seenIds.has(obj._id.toString())) {
//       seenIds.add(obj._id.toString());
//       res.push(obj);
//     }
//   }
//   return res;
// }

export default async function Search({ searchParams }) {
  const filter = searchParams.filter;
  const session = await getServerSession(authOptions);
  const userId = session.user.userId;
  const res = await fetch(`https://retiform.vercel.app/api/users/${userId}/search/${filter}`, {cache: 'no-store'});
  const data = await res.json();
  return (
    <div className="container">
      <FriendsSection
        friends={JSON.stringify(data.users)}
        heading={`Results for "${searchParams.filter}"`}
      />
    </div>
  );
}
