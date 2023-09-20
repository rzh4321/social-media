import User from "../../../../models/User";
import connectToDB from "../../../../utils/database";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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

export async function GET(req, context) {
  await connectToDB();
  const filter = context.params.filter;
  const session = await getServerSession(authOptions);
  const userId = session.user.userId;
  const users = await getUsersFromFilter(filter, userId);
  
  return NextResponse.json({ users});
    
}