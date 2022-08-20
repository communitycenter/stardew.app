import React, { ChangeEvent } from "react";
import { Fragment } from "react";
import Link from "next/link";
import { Popover } from "@headlessui/react";
import Image from "next/image";
import { useState, useEffect } from "react";

import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

import { FaUserCircle } from "react-icons/fa";

import { getCookie } from "cookies-next";
import { BiImport } from "react-icons/bi";
import Login from "./inputs/login";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const UserSignedIn = () => {
  const [user, setUser] = useState<{
    discord_name: string;
    discord_id: string;
    discord_avatar: string;
  } | null>(null);
  useEffect(() => {
    try {
      const cookie = getCookie("discord_user");
      if (!cookie) setUser(null);
      setUser(JSON.parse(cookie as string));
    } catch (e) {
      setUser(null);
    }
  }, []);
  return (
    <Menu as="div" className="flex space-x-2">
      <div
        className={classNames(
          "flex border bg-gray-100 text-black dark:border-[#2A2A2A] dark:bg-[#1F1F1F] dark:text-white" +
            "group flex items-center rounded-md py-4 px-3 text-base font-medium"
        )}
      >
        <Menu.Button className="flex">
          <img
            className={classNames(
              "mr-3 h-5 w-5 flex-shrink-0 rounded-2xl text-black dark:text-white"
            )}
            aria-hidden="true"
            src="https://i.pinimg.com/564x/8f/1b/09/8f1b09269d8df868039a5f9db169a772.jpg"
            alt="User avatar"
            height={24}
            width={24}
          />
          <p className="ml-2 dark:text-white">Test</p>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="relative divide-y divide-[#2A2A2A]  rounded-md border bg-gray-100 shadow-lg ring-opacity-5 focus:outline-none dark:border-[#2a2a2a]  dark:bg-[#1F1F1F] dark:text-white">
          <div className="px-4 py-3">
            <p className="text-sm text-[#7D7D7D]">stardew.app {"<3"}</p>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link key="discord" href="/">
                  <a
                    className={classNames(
                      "group flex items-center rounded-md py-2 px-5 text-base font-medium text-[#7D7D7D] hover:bg-gray-50 hover:text-white dark:border-[#2A2A2A]  dark:bg-[#1F1F1F] dark:hover:bg-[#141414]"
                    )}
                  >
                    Credits
                  </a>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link key="discord" href="/">
                  <a
                    className={classNames(
                      "group flex items-center rounded-md py-2 px-5 text-base font-medium text-[#7D7D7D] hover:bg-gray-50 hover:text-white dark:border-[#2A2A2A]  dark:bg-[#1F1F1F] dark:hover:bg-[#141414]"
                    )}
                  >
                    Delete uploaded data
                  </a>
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <form method="POST" action="#">
              <Menu.Item>
                {({ active }) => (
                  <Link key="discord" href="/">
                    <a
                      className={classNames(
                        "group flex items-center rounded-md py-2 px-5 text-base font-medium text-[#7D7D7D] hover:bg-gray-50 hover:text-white dark:border-[#2A2A2A]  dark:bg-[#1F1F1F] dark:hover:bg-[#141414]"
                      )}
                    >
                      Log out
                    </a>
                  </Link>
                )}
              </Menu.Item>
            </form>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserSignedIn;
