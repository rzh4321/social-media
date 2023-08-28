'use client';

import Provider from "@/components/Provider";
import { useState, useEffect } from "react";
import CardLogin from "@/components/CardLogin";
import CardSignup from "@/components/CardSignup";
import HomeBanner from "@/components/HomeBanner";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const SignIn = () => {
    const [signupCard, setSignupCard] = useState(false);
    const {data: session} = useSession();
    const router = useRouter();
    
    useEffect(() => {
        if (session && session.user) {
            return router.push('/home')
        }
    }, [router, session])


        return    (<>
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
            </>);
}
