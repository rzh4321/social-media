"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { signIn } from "next-auth/react";
import styles from "../styles/Home.module.css";

// type CardLoginProps = {
//   switchToSignup: Dispatch<SetStateAction<boolean>>;
// };

export default function CardLogin({ switchToSignup }) {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const handleLogin = async (
    e
  ) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginFailed(false);
    const res = await signIn("credentials", {
      redirect: false,
      username: usernameInput,
      password: passwordInput,
      callbackUrl: "/home",
    });
    if (res && !res.ok) {
      setLoginLoading(false);
      setLoginFailed(true);
    }
  };

  const handleSwitchSignup = () => {
    switchToSignup(true);
  };

  const handleVisitorLogin = async () => {
    setLoginLoading(true);
    setLoginFailed(false);
    const res = await fetch(`/api/auth/general-visitor-login`, {
      method: "POST",
    });
    const data = await res.json();
    console.log('we back to handleVisitorLogin function. we called general visitor login api. the res is ', data);
    // should return newly created (or existing) user object. Use user object to sign in, but use unhashed pw
    const signInRes = await signIn("credentials", {
      redirect: false,
      username: data.user.username,
      password: data.user.username,
      callbackUrl: "/home",
    });

    console.log("login api returned response. it is ", signInRes);
    if (signInRes && !signInRes.ok) {
      setLoginLoading(false);
      setLoginFailed(true);
    }
  };

  return (
    <div className={`card shadow-sm p-4 ${styles.cardlogin}`}>
      <form>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="name@example.com"
            required
            onChange={(e) => setUsernameInput(e.target.value)}
            value={usernameInput}
          />
          <label htmlFor="username">Username</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="password"
            required
            onChange={(e) => setPasswordInput(e.target.value)}
            value={passwordInput}
          />
          <label htmlFor="password" className="form-label">
            Password
          </label>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loginLoading}
          onClick={handleLogin}
        >
          {!loginLoading && "Log in"}
          {loginLoading && (
            <div>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </button>
        <div className="border-bottom mt-2 mb-3" />
        <button
          className="btn btn-success mt-3 mb-2 w-100"
          onClick={handleSwitchSignup}
        >
          Create an account
        </button>
        {loginFailed && (
          <div className="py-0 text-danger text-center">
            <small>Log in failed</small>
          </div>
        )}
      </form>
      <div className="border-bottom mt-2 mb-3" />
      <button
        className="btn btn-outline-primary w-100"
        onClick={() => {
          signIn("google", { callbackUrl: "/home" });
        }}
      >
        Log in with Google
      </button>
      <button
        className="btn btn-outline-primary mt-3 w-100"
        onClick={handleVisitorLogin}
      >
        Log in as Visitor
      </button>
    </div>
  );
}
