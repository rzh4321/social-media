"use client";

import { useState } from "react";
import CardLogin from "../../components/CardLogin";
import CardSignup from "../../components/CardSignup";
import HomeBanner from "../../components/HomeBanner";
import "../../styles/Home.css";

const SignIn = () => {
  const [signupCard, setSignupCard] = useState(false);

  return (
    <>
      <div className="container-fluid py-5">
        <div className="container-sm">
          <div className="row align-items-center justify-content-center gx-5">
            <div className="col-sm-6">
              <HomeBanner />
            </div>
            <div className="col-sm">
              {signupCard ? (
                <CardSignup switchToSignup={setSignupCard} />
              ) : (
                <CardLogin switchToSignup={setSignupCard} status={status} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
