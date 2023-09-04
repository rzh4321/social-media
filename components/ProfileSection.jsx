'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import '../styles/profile.css';
import { useEffect, useRef, useState } from "react";
import Image from "next/image";


export default function ProfileSection({ edit, stringData, setUserData }) {
    const { data: session, status } = useSession();
    const [userData, getUserData] = useState({});
    
    useEffect(() => {
        getUserData(JSON.parse(stringData));
        console.log('userdata is ', userData)
    }, [stringData, userData])


    return (
      <div className={`mx-auto row profile-card`}>
        {userData.profilePicUrl
        ?
        <div className={`col m-2 p-0 user-profile-pic-div`}>
          <Image className={`rounded-circle profile-user-profile-pic`} src={userData.profilePicUrl} alt='profile pic'
          width={40} height={40} />
        </div>
        :
        <div className={`col m-2 p-0 rounded-circle user-profile-pic-div`}>
          <span className={`user-profile-pic-icon material-symbols-outlined`}>
          <svg
              className="profile-user-profile-pic post-card"
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
        }
        <div className="col my-auto">
          <h1 className="mb-0"><strong>{userData.name}</strong></h1>
          <div>{`@${userData.username}`}</div>
          <div className="text-secondary">
            {(userData.friends?.length > 1 || userData.friends?.length === 0) ? `${userData.friends?.length} friends` : `${userData.friends?.length} friend`}
          </div>
        </div>
        {/*edit.current && <ProfileEditModal userData={userData} setUserData={setUserData} />*/}
      </div>
    );
  }