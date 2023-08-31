import "../styles/homefeed.css";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DateTime } from "luxon";
import Link from "next/link";

// feedType: 'all' || 'home' || 'profile' || 'user'
export default function HomeFeed({ feedType, postsData }) {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [endOfFeed, setEndOfFeed] = useState(false);
  const [postsLoading, setPostsLoading] = useState(true);
  const [authuserData, setAuthuserData] = useState({});
  const router = useRouter();

  // Fetch authuser form session.user.userId and pass along the authuserData
  useEffect(() => {
    async function fetchAuthuser() {
      const res = await fetch(`/api/users/${session.user.userId}`);
      const data = await res.json();
      setAuthuserData(data.user);
    }
    if (status === "loading") return;
    // no need to check for session, already did in navbar
    fetchAuthuser();
  }, [session, status]);

  // Fetch posts according to the home feedType
  useEffect(() => {
    async function fetchAuthuserPostsAndSetPosts() {
      const res = await fetch(`$/api/authuser/posts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.posts.length < 10) {
        setEndOfFeed(true);
      }
      setPosts(data.posts);
      setPostsLoading(false);
    }

    async function fetchFeedPostsAndSetPosts() {
      const res = await fetch(
        `/api/authuser/feed-posts/${session.user.userId}`,
      );
      const data = await res.json();
      console.log("back from feed posts api call. data is ", data.posts);
      if (data.posts.length < 10) {
        console.log("less than 10 posts so endoffeed is true");
        setEndOfFeed(true);
      }
      setPosts(data.posts);
      setPostsLoading(false);
    }

    async function fetchAllPostsAndSetPosts() {
      // Fetch 10 of all posts starting from the most recent one
      const res = await fetch(`/api/posts`);
      const data = await res.json();
      // less than 10 posts returned means we already reached end of feed
      if (data.posts.length < 10) {
        setEndOfFeed(true);
      }
      setPosts(data.posts);
      setPostsLoading(false);
    }
    function setUserPosts() {
      if (posts.length < 10) {
        setEndOfFeed(true);
      }
      setPostsLoading(false);
      setPosts(postsData);
    }

    if (status === "loading") return;

    switch (feedType) {
      case "home":
        console.log("feed type is home");
        fetchFeedPostsAndSetPosts();
        break;
      case "profile":
        fetchAuthuserPostsAndSetPosts();
        break;
      case "all":
        fetchAllPostsAndSetPosts();
        break;
      case "user":
        setUserPosts();
        break;
    }
  }, [session, feedType, posts.length, postsData, status]);
  return <></>;
}
