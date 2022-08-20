import React from "react";
import Link from "next/link";

import { FaUserCircle } from "react-icons/fa";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const Login = () => {
  return (
    <div className="mt-4 flex-1 justify-end space-y-2 bg-white dark:bg-[#111111]">
      <Link href="/api/oauth">
        <a className="group flex items-center rounded-md border bg-gray-100 py-4 px-5 text-base font-medium text-black hover:cursor-pointer dark:border-[#2a2a2a] dark:bg-[#1f1f1f] dark:text-white hover:dark:bg-[#191919]">
          <FaUserCircle
            className={classNames(
              "mr-3 h-5 w-5 flex-shrink-0 text-black dark:text-white"
            )}
            aria-hidden="true"
          />
          <p className="dark:text-white">Login</p>
        </a>
      </Link>
    </div>
  );
};

export default Login;
