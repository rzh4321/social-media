'use client';

import Provider from "@/components/Provider";
import { useState } from "react";

export const metadata = {
  title: "title",
  description: "some desc",
};

const SignIn = () => {
    const [signupCard, setSignupCard] = useState(false);

  <>
    <div className="container-fluid py-5 bg-light">
      <div className="container-sm">
        <div className="row align-items-center justify-content-center gx-5">
          <div className="col-sm-6">
            <HomeBanner />
          </div>
          <div className="col-sm">
            {signupCard ? (
              <CardSignup switchToSignup={setSignupCard} />
            ) : (
              <CardLogin switchToSignup={setSignupCard} />
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>;
};
