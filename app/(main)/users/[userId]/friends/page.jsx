import User from "../../../../../models/User";
import FriendsSection from "../../../../../components/FriendsSection";
import "../../../../../styles/friends.css";

async function findUser(userId) {
  const user = await User.findById(userId).populate(
    "friends friendRequestsSent friendRequestsReceived",
  );
  return user;
}

export default async function FriendsPage({ params }) {
  const user = await findUser(params.userId);

  return (
    <div className="container mt-4">
      <FriendsSection
        friends={JSON.stringify(user.friends)}
        heading={`${user.name}'s Friends`}
      />
    </div>
  );
}
