import FriendCard from "./FriendCard";

export default function FriendsSection({ friends }) {
  if (friends.length > 0) {
    return (
      <ul className={`ps-0 mx-auto user-card`}>
        <h1 className="fs-3 mb-0">Friends</h1>
        {friends.map((user) => (
          <FriendCard key={user._id} user={user} />
        ))}
      </ul>
    );
  }
}
