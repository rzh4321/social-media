"use client";

import "../styles/homefeed.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import NewPostCard from "./NewPostCard";
import FeedList from "./FeedList";

// feedType: 'all' || 'home' || 'profile' || 'user'
export default function HomeFeed({ feedType, postsData, authuserData }) {
  const [posts, setPosts] = useState([]);
  const [endOfFeed, setEndOfFeed] = useState(false);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    async function getPosts() {
      setPostsLoading(false);
      const parsedPosts = JSON.parse(postsData);
      if (parsedPosts.length < 10) {
        setEndOfFeed(true);
      }
      setPosts(parsedPosts);
      setPostsLoading(false);
    }
    getPosts();
  }, [postsData]);

  return (
    <div className="container mt-4">
      <div className="d-flex p-2">
        <Link
          className="my-feed text-decoration-none w-50 d-flex align-items-center justify-content-center"
          href="/home"
        >
          {(feedType === "all" || feedType === "home") && (
            <div className="fs-4 text-primary">
              <strong>My Feed</strong>
            </div>
          )}
        </Link>
        <Link
          className="all-posts text-decoration-none w-50 d-flex align-items-center justify-content-center"
          href="/all"
        >
          {(feedType === "all" || feedType === "home") && (
            <div className="fs-4 text-primary">
              <strong>All</strong>
            </div>
          )}
        </Link>
      </div>
      {(feedType === "all" || feedType === "home") && (
        <div className="border-top mb-4"></div>
      )}
      {feedType !== "user" && (
        <NewPostCard authuserData={JSON.parse(authuserData)} setPosts={setPosts} posts={posts} />
      )}
      {feedType === "profile" && (
        <h3 className={`mx-auto mt-4 mb-0 feed-card`}>Your posts</h3>
      )}
      <FeedList
        posts={posts}
        setPosts={setPosts}
        postsLoading={postsLoading}
        authuserData={JSON.parse(authuserData)}
        feedType={feedType}
        endOfFeed={endOfFeed}
      />
    </div>
  );
}
