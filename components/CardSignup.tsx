'use client';

import { Dispatch, SetStateAction, useState } from "react";
import { signIn } from 'next-auth/react';
import styles from '../styles/Home.module.css';

type CardSignupProps = {
    switchToSignup: Dispatch<SetStateAction<boolean>>;
}

type apiResError = {
    errors : [];
    input : {username: string; password: string}
}

type apiResSuccess = {
    message: string;
    user: {
        name: String;
        username: String;
        password: String;
        friends: [];
        friendRequestsSent: [];
        friendRequestsReceived: [];
        profileUrl: String;
        posts: [];
    };
}

type apiRes = apiResError | apiResSuccess;

export default function CardSignup({ switchToSignup } : CardSignupProps) {
    const [nameInput, setNameInput] = useState('');
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [signupLoading, setSignupLoading] = useState(false);
    const [signupFailed, setSignupFailed] = useState(false);
    const [signupErrors, setSignupErrors] = useState<String[]>([]);
  
    return (
      <div className={`card shadow-sm p-4 ${styles.cardlogin}`}>
        <form>
          <div className='form-floating mb-3'>
            <input type='text' className='form-control' id='name' placeholder='Name' required
              onChange={(e) => setNameInput(e.target.value)}
              value={nameInput}
            />
            <label htmlFor='name'>Name</label>
          </div>
          <div className='form-floating mb-3'>
            <input type='text' className='form-control' id='username' placeholder='Username' required
              onChange={(e) => setUsernameInput(e.target.value)}
              value={usernameInput}
            />
            <label htmlFor='username'>Username</label>
          </div>
          <div className='form-floating mb-3'>
            <input type='password' className='form-control' id='password' placeholder='Password' required
              onChange={(e) => setPasswordInput(e.target.value)}
              value={passwordInput}
            />
            <label htmlFor='password' className='form-label'>Password</label>
          </div>
          <button type='submit' className='btn btn-success w-100' disabled={signupLoading}
            onClick={
              async (e) => {
                e.preventDefault();
                setSignupLoading(true);
                const res = await fetch(`app/api/auth/signup`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: nameInput,
                    username: usernameInput,
                    password: passwordInput,
                  }),
                });
                const data : any = await res.json();
                if (data.errors) {
                  setNameInput(data.input.name);
                  setUsernameInput(data.input.username);
                  setPasswordInput(data.input.password);
                  setSignupErrors(data.errors);
                  setSignupLoading(false);
                }
                if (res.status !== 201) {
                  setSignupLoading(false);
                  setSignupFailed(true);
                }
                if (res.status === 201) {
                  setSignupLoading(false);
                  setSignupFailed(false);
                  const res = await signIn('credentials', { 
                    redirect: false,
                    username: usernameInput,
                    password: passwordInput,
                    callbackUrl: '/home',
                  });
                }
              }}
          >
            {!signupLoading && 'Sign up'}
            {signupLoading && 
            <div>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span className="visually-hidden">Loading...</span>
            </div>}
          </button>
          {signupFailed && <div className='mt-1 py-0 text-danger text-center'><small>Sign up failed</small></div>}
          {signupErrors.map((error, index) => (
            <div key={index} className='mt-1 py-0 text-danger text-center'><small>{error}</small></div>
          ))
          }
        </form>
        <div className='border-bottom mt-3 mb-3'/>
        <button className='btn btn-outline-secondary w-100'
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