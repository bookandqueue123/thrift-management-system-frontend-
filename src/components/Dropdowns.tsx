"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const AvatarDropdown = ({ logoutFn, avatarImg, routeOptions }: { logoutFn?: () => void; avatarImg: string; routeOptions: string[]; }) => {
  const [AvatarMenuIsOpen, setAvatarMenuIsOpen] = useState(false);

  return (
    <div className="pr-2 md:pl-11">
      {/* <!-- Profile dropdown --> */}
      <button
        type="button"
        className="flex items-center gap-x-2 rounded-full"
        onClick={() => setAvatarMenuIsOpen(!AvatarMenuIsOpen)}
      >
        <Image
          className="h-6 w-6 rounded-full"
          src={avatarImg}
          alt="user image"
          width={24}
          height={24}
        />
        <svg width="10" height="5" viewBox="0 0 12 7" fill="none">
          <path
            d="M1 1L6 6L11 1"
            stroke="#BDBDBD"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="sr-only">Open user menu</span>
      </button>
      {AvatarMenuIsOpen && (
        <div className="absolute right-0 top-14 z-10 mt-2 w-48  rounded-md bg-white bg-opacity-20 py-1 shadow-lg">
          {routeOptions.map((route, index) => {
            if (route.toLowerCase() === 'sign out' && logoutFn) {
              return (
                <a
                  key={route}
                  onClick={logoutFn}
                  className={`cursor-pointer block px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue`}
                >
                  {route}
                </a>
              );
            } else {
              return (
                <Link
                  key={route}
                  href={`/customer/${route.toLowerCase()}`}
                  className={`block px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue`}
                >
                  {route}
                </Link>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
