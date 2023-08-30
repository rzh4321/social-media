"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../styles/navbar.module.css";
import { useRouter, usePathname } from "next/navigation";

export default function NavBar() {
  const { data: session, status } = useSession();
  // activeNavLink: 'home' || 'friends' || 'posts'
  const [activeNavLink, setActiveNavLink] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const [authuserData, setAuthuserData] = useState({});

  // Fetch authuser from session.user.userId and pass along the authuserData
  useEffect(() => {
    async function fetchAuthuser() {
      //   const res = await fetch(`/api/users/${session.user.userId}`);
      //   const data = await res.json();
      //   setAuthuserData(data.user);
      console.log("hi");
    }
    if (status === "loading") return;
    if (session) {
      fetchAuthuser();
    } else {
      return router.push("/");
    }
  }, [session, router, status]);

  // Set activeNavLink from pathname
  useEffect(() => {
    if (pathname === "/home") {
      setActiveNavLink("home");
    } else if (pathname === "/friends") {
      setActiveNavLink("friends");
    } else if (pathname === "/posts") {
      setActiveNavLink("posts");
    }
  }, [pathname]);

  // Enable Bootstrap tooltips when NavBar is created
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    );
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="navbar navbar-expand-sm bg-white shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand text-primary fs-4" href="/">
          <strong>App</strong>
        </a>
        <div className="navbar-nav me-auto mb-lg-0 d-flex flex-row gap-2">
          <a
            className={`nav-link ${activeNavLink === "home" ? "active" : ""}`}
            aria-current="page"
            href="/"
            data-bs-toggle="tooltip"
            data-bs-title="Home"
            data-bs-placement="bottom"
          >
            <span className={`material-symbols-outlined ${styles.navItemIcon}`}>
              home
            </span>
          </a>
          <a
            className={`nav-link ${
              activeNavLink === "friends" ? "active" : ""
            }`}
            href="/friends"
            data-bs-toggle="tooltip"
            data-bs-title="Friends"
            data-bs-placement="bottom"
          >
            <span className={`material-symbols-outlined ${styles.navItemIcon}`}>
              group
            </span>
          </a>
          <a
            className={`nav-link ${activeNavLink === "posts" ? "active" : ""}`}
            href="/posts"
            data-bs-toggle="tooltip"
            data-bs-title="Posts"
            data-bs-placement="bottom"
          >
            <span className={`material-symbols-outlined ${styles.navItemIcon}`}>
              article
            </span>
          </a>
        </div>
        <div
          className="dropdown"
          data-bs-toggle="tooltip"
          data-bs-title="Account"
          data-bs-placement="bottom"
        >
          {authuserData.profile_pic_url ? (
            <Image
              className={`dropdown-toggle rounded-circle ${styles.userProfilePic}`}
              src={authuserData.profile_pic_url}
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              alt="profile picture"
            />
          ) : (
            <div
              className={`dropdown-toggle rounded-circle ${styles.userProfilePic}`}
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span
                className={`${styles.userProfilePicIcon} material-symbols-outlined`}
              >
                account_circle
              </span>
            </div>
          )}
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <a className="dropdown-item" href="/profile">
                Profile
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button
                className="dropdown-item text-danger"
                onClick={handleLogout}
              >
                Log out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
