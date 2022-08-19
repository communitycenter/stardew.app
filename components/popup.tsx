import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Popup() {
  return (
    <Menu as="div" className=" text-left">
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="ml-2 mr-2 divide-y divide-[#2A2A2A]  rounded-md border bg-gray-100 shadow-lg ring-opacity-5 focus:outline-none dark:border-[#2a2a2a]  dark:bg-[#1F1F1F] dark:text-white">
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
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          Options
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>
    </Menu>
  );
}
