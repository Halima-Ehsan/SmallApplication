"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { UserAuth } from "../context/AuthContext"

const Navbar = () => {
  const { user, googleSignIn, logOut } = UserAuth();
  const [navLoading, setNavLoading] = useState(true);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setNavLoading(false);
    };
    checkAuthentication();
  }, []);

  return (
    <nav className='h-20 w-full p-2 flex justify-between items-center'>
      <div className="container mx-auto flex justify-between items-center p-2">
        <ul className="flex space-x-6">
          <li className='p-2 cursor-pointer'>
            <Link href="/" className=' cursor-pointer'>Home</Link>
          </li>
        </ul>
        {!navLoading && (
          !user ? (
            <ul className='flex'>
              <li onClick={handleSignIn} className='p-2 cursor-pointer'>
                Login
              </li>
            </ul>
          ) : (
            <ul>
              <li>Welcome, {user.displayName}</li>
              <li className='cursor-pointer' onClick={handleSignOut}>
                Sign out
              </li>
            </ul>
          )
        )}
      </div>
    </nav>
  );
};


export default Navbar;
