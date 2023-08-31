"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import "../styles/navbar.css";
import Link from "next/link";
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
      const res = await fetch(`/api/users/${session.user.userId}`);
      const data = await res.json();
      setAuthuserData(data.user);
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
    // const tooltipList = [...tooltipTriggerList].map(
    //   (tooltipTriggerEl) => new window.bootstrap.Tooltip(tooltipTriggerEl),
    // );
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="navbar navbar-expand-sm shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand text-primary fs-4" href="/home">
          <strong>App</strong>
        </a>
        <div className="navbar-nav me-auto mb-lg-0 d-flex flex-row gap-2">
          <a
            className={`nav-link ${activeNavLink === "home" ? "active" : ""}`}
            aria-current="page"
            href="/home"
            data-bs-toggle="tooltip"
            data-bs-title="Home"
            data-bs-placement="bottom"
          >
            <span className={`material-symbols-outlined nav-item-icon`}>
              <svg
                className={`nav-icon`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
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
            <span className={`material-symbols-outlined nav-item-icon`}>
              <svg
                className="nav-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            </span>
          </a>
        </div>
        <div
          className="dropdown"
          data-bs-toggle="tooltip"
          data-bs-title="Account"
          data-bs-placement="bottom"
        >
          {authuserData.profilePicUrl ? (
            <Image
              className={`dropdown-toggle rounded-circle user-profile-pic`}
              src={authuserData.profilePicUrl}
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              alt="profile pic"
              width={40}
              height={40}
            />
          ) : (
            <div
              className={`dropdown-toggle rounded-circle user-profile-pic-arrow`}
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span
                className={`user-profile-pic-icon} material-symbols-outlined`}
              >
                <svg
                  className="user-profile-pic"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
            </div>
          )}
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <Link className="dropdown-item" href="/profile">
                Profile
              </Link>
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
