"use server"

import User from "./models/User";

export async function getUsersFromFilter(filter, userId) {
    try {
        const regex = new RegExp(`^${filter}`, "i"); // 'i' makes the search case-insensitive
        const names = await User.find({ name: regex, _id: { $ne: userId } });
        const usernames = await User.find({ username: regex, _id: { $ne: userId } });
        const res = [...names];
        const seenIds = new Set(names.map((obj) => obj._id.toString()));
        // make sure there are no duplicate users
        for (const obj of usernames) {
        if (!seenIds.has(obj._id.toString())) {
            seenIds.add(obj._id.toString());
            res.push(obj);
        }
        }
        return res;
    }
    catch(err) {
        throw new Error(err);
    }
  }