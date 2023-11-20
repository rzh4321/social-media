"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { z } from "zod";

const schema = z
  .object({
    name: z.string().refine(
      (value) => {
        const trimmedValue = value.trim();
        return trimmedValue.length >= 1;
      },
      { message: "Name is required" },
    ),

    username: z.string().refine(
      (value) => {
        const trimmedValue = value.trim();
        return trimmedValue.length >= 1;
      },
      { message: "Username is required" },
    ),

    password: z.string().refine(
      (value) => {
        const trimmedValue = value.trim();
        return trimmedValue.length >= 6;
      },
      { message: "Password must be at least 6 characters" },
    ),
  })
  .transform({
    name: (val) => val.trim(),
    username: (val) => val.trim(),
    password: (val) => val.trim(),
  });

export default function CardSignup({ switchToSignup }) {
  const [nameInput, setNameInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupErrors, setSignupErrors] = useState([]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    try {
      const validate = schema.parse({
        name: nameInput,
        username: usernameInput,
        password: passwordInput,
      });
    } catch (err) {
      const errorsArr = err.issues.map((obj) => {
        return obj.message;
      });
      setSignupErrors(errorsArr);
      setSignupLoading(false);
      return;
    }

    const res = await fetch(`/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameInput,
        username: usernameInput,
        password: passwordInput,
      }),
    });
    const data = await res.json();
    if (res.status !== 201) {
      setSignupErrors(data.errors);
      setNameInput(data.input.name);
      setUsernameInput(data.input.username);
      setPasswordInput(data.input.password);
    } else if (res.status === 201) {
      const res = await signIn("credentials", {
        redirect: true,
        username: usernameInput,
        password: passwordInput,
        callbackUrl: "/home", // should redirect to home page after successful signup
      });
    }
    setSignupLoading(false);
  };

  return (
    <div className={`card shadow-sm p-4 card-login`}>
      <form>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Name"
            required
            onChange={(e) => setNameInput(e.target.value)}
            value={nameInput}
          />
          <label htmlFor="name">Name</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Username"
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
            placeholder="Password"
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
          className="btn btn-success w-100"
          disabled={signupLoading}
          onClick={handleSignup}
        >
          {!signupLoading && "Sign up"}
          {signupLoading && (
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
        {signupErrors.length > 0 && (
          <div className="mt-1 py-0 text-danger text-center">
            <small>Sign up failed</small>
          </div>
        )}
        {signupErrors.map((error, index) => (
          <div key={index} className="mt-1 py-0 text-danger text-center">
            <small>{error}</small>
          </div>
        ))}
      </form>
      <div className="border-bottom mt-3 mb-3" />
      <button
        className="btn btn-outline-secondary w-100"
        onClick={(e) => {
          e.preventDefault();
          switchToSignup(false);
        }}
      >
        Back to log in
      </button>
    </div>
  );
}
