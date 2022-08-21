import { Fragment, useState } from "react";
// import { Menu, Transition } from "@headlessui/react";
// import { ChevronDownIcon } from "@heroicons/react/solid";
// import Link from "next/link";
// import { FaDiscord } from "react-icons/fa";
import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { deleteCookie } from "cookies-next";
import CreditsModal from "./modals/credits";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  user: any;
}

export default function Popup({ user }: Props) {
  const [showCreditsSlideover, setShowCreditsSlideover] =
    useState<boolean>(false);
  return (
    <>
      <Popover.Root>
        <div className="flex-1">
          <Popover.Trigger asChild>
            <div className="group flex w-full items-center rounded-md border bg-gray-100 py-4 px-5 text-base text-black hover:cursor-pointer dark:border-[#2a2a2a] dark:bg-[#1f1f1f] dark:text-white hover:dark:bg-[#191919]">
              {/* <FaUserCircle
              className={classNames(
                "mr-3 h-5 w-5 flex-shrink-0 text-black dark:text-white"
              )}
              aria-hidden="true"
            /> */}
              <Image
                className={classNames(
                  "mr-3 h-5 w-5 flex-shrink-0 rounded-2xl text-black dark:text-white"
                )}
                aria-hidden="true"
                src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.discord_avatar}.png`}
                alt="User avatar"
                height={24}
                width={24}
              />
              <div className="truncate">
                <div className="font-normal dark:text-white">
                  {user.discord_name}
                </div>
              </div>
            </div>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content>
              <div className="mr-8 mb-2 w-full  divide-y divide-[#2A2A2A] rounded-md border bg-gray-100 font-medium shadow-md ring-opacity-5 drop-shadow-lg transition focus:outline-none  dark:border-[#2a2a2a] dark:bg-[#1F1F1F] dark:text-white">
                <div className="px-4 py-3">
                  <p className="text-sm text-[#7D7D7D]">stardew.app v0.0.1</p>
                </div>
                <div className="py-1 font-normal">
                  <div>
                    <div
                      onClick={() => setShowCreditsSlideover(true)}
                      className={classNames(
                        "group flex items-center rounded-md py-2 px-5 text-base font-normal text-[#7D7D7D] hover:cursor-pointer hover:bg-gray-50 hover:text-white  dark:border-[#2A2A2A] dark:bg-[#1F1F1F] dark:hover:bg-[#141414]"
                      )}
                    >
                      Credits
                    </div>
                  </div>
                  <div>
                    <a
                      className={classNames(
                        "group flex items-center rounded-md py-2 px-5 text-base font-normal text-[#7D7D7D] hover:cursor-pointer hover:bg-gray-50 hover:text-white  dark:border-[#2A2A2A] dark:bg-[#1F1F1F] dark:hover:bg-[#141414]"
                      )}
                    >
                      Delete uploaded data
                    </a>
                  </div>
                </div>
                <div className="py-1">
                  <div
                    onClick={() => {
                      deleteCookie("token");
                      deleteCookie("uid");
                      deleteCookie("oauth_state");
                      deleteCookie("discord_user");
                      return (window.location.href = "/");
                    }}
                    className={classNames(
                      "group flex w-full items-center rounded-md py-2 px-5 text-base font-normal text-[#7D7D7D] hover:cursor-pointer hover:bg-gray-50 hover:text-white  dark:border-[#2A2A2A] dark:bg-[#1F1F1F] dark:hover:bg-[#141414]"
                    )}
                  >
                    Log out
                  </div>
                </div>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </div>
      </Popover.Root>
      <CreditsModal
        isOpen={showCreditsSlideover}
        setOpen={setShowCreditsSlideover}
      />
    </>
  );
}

// export default function Popup() {
//   return (
//     <Menu as="div" className=" text-left">
//       <Transition
//         as={Fragment}
//         enter="transition ease-out duration-100"
//         enterFrom="transform opacity-0 scale-95"
//         enterTo="transform opacity-100 scale-100"
//         leave="transition ease-in duration-75"
//         leaveFrom="transform opacity-100 scale-100"
//         leaveTo="transform opacity-0 scale-95"
//       >
//         <Menu.Items className="ml-2 mr-2 divide-y divide-[#2A2A2A]  rounded-md border bg-gray-100 shadow-lg ring-opacity-5 focus:outline-none dark:border-[#2a2a2a]  dark:bg-[#1F1F1F] dark:text-white">
//           <div className="px-4 py-3">
//             <p className="text-sm text-[#7D7D7D]">stardew.app {"<3"}</p>
//           </div>
//           <div className="py-1">
//             <Menu.Item>
//               {({ active }) => (
//                 <Link key="discord" href="/">
//                   <a
//                     className={classNames(
//                       "group flex items-center rounded-md py-2 px-5 text-base font-medium text-[#7D7D7D] hover:bg-gray-50 hover:text-white dark:border-[#2A2A2A]  dark:bg-[#1F1F1F] dark:hover:bg-[#141414]"
//                     )}
//                   >
//                     Credits
//                   </a>
//                 </Link>
//               )}
//             </Menu.Item>
//             <Menu.Item>
//               {({ active }) => (
//                 <Link key="discord" href="/">
//                   <a
//                     className={classNames(
//                       "group flex items-center rounded-md py-2 px-5 text-base font-medium text-[#7D7D7D] hover:bg-gray-50 hover:text-white dark:border-[#2A2A2A]  dark:bg-[#1F1F1F] dark:hover:bg-[#141414]"
//                     )}
//                   >
//                     Delete uploaded data
//                   </a>
//                 </Link>
//               )}
//             </Menu.Item>
//           </div>
//           <div className="py-1">
//             <form method="POST" action="#">
//               <Menu.Item>
//                 {({ active }) => (
//                   <Link key="discord" href="/">
//                     <a
//                       className={classNames(
//                         "group flex items-center rounded-md py-2 px-5 text-base font-medium text-[#7D7D7D] hover:bg-gray-50 hover:text-white dark:border-[#2A2A2A]  dark:bg-[#1F1F1F] dark:hover:bg-[#141414]"
//                       )}
//                     >
//                       Log out
//                     </a>
//                   </Link>
//                 )}
//               </Menu.Item>
//             </form>
//           </div>
//         </Menu.Items>
//       </Transition>
//       <div className="flex">
//         <Menu.Button className="flex-1 rounded-md border bg-gray-100 text-black dark:border-[#2A2A2A] dark:bg-[#1F1F1F]  dark:text-white">
//           <div className="flex py-4 px-3">
//             <img
//               className={classNames(" rounded-2xl text-black dark:text-white")}
//               aria-hidden="true"
//               src="https://i.pinimg.com/564x/8f/1b/09/8f1b09269d8df868039a5f9db169a772.jpg"
//               alt="User avatar"
//               height={24}
//               width={24}
//             />
//             <p className="ml-2 dark:text-white">bruh</p>
//           </div>
//         </Menu.Button>
//       </div>
//     </Menu>
//   );
// }

// import { Popover, Transition } from "@headlessui/react";
// import { ChevronDownIcon } from "@heroicons/react/solid";
// import { Fragment } from "react";
// import { FaDice } from "react-icons/fa";

// const solutions = [
//   {
//     name: "Insights",
//     description: "Measure actions your users take",
//     href: "##",
//     icon: FaDice,
//   },
//   {
//     name: "Automations",
//     description: "Create your own targeted content",
//     href: "##",
//     icon: FaDice,
//   },
//   {
//     name: "Reports",
//     description: "Keep track of your growth",
//     href: "##",
//     icon: FaDice,
//   },
// ];

// export default function Example() {
//   return (
//     <div className="ml-2 mr-2 divide-y divide-[#2A2A2A]  rounded-md border bg-gray-100 shadow-lg ring-opacity-5 focus:outline-none dark:border-[#2a2a2a]  dark:bg-[#1F1F1F] dark:text-white">
//       <Popover className="relative">
//         {({ open }) => (
//           <>
//             <Popover.Button
//               className={`
//                 ${open ? "" : "text-opacity-90"}
//                 group inline-flex items-center rounded-md bg-orange-700 px-3 py-2 text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
//             >
//               <span>Solutions</span>
//               <ChevronDownIcon
//                 className={`${open ? "" : "text-opacity-70"}
//                   ml-2 h-5 w-5 text-orange-300 transition duration-150 ease-in-out group-hover:text-opacity-80`}
//                 aria-hidden="true"
//               />
//             </Popover.Button>
//             <Transition
//               as={Fragment}
//               enter="transition ease-out duration-200"
//               enterFrom="opacity-0 translate-y-1"
//               enterTo="opacity-100 translate-y-0"
//               leave="transition ease-in duration-150"
//               leaveFrom="opacity-100 translate-y-0"
//               leaveTo="opacity-0 translate-y-1"
//             >
//               <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
//                 <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
//                   <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
//                     {solutions.map((item) => (
//                       <a
//                         key={item.name}
//                         href={item.href}
//                         className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
//                       >
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
//                           <item.icon aria-hidden="true" />
//                         </div>
//                         <div className="ml-4">
//                           <p className="text-sm font-medium text-gray-900">
//                             {item.name}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             {item.description}
//                           </p>
//                         </div>
//                       </a>
//                     ))}
//                   </div>
//                   <div className="bg-gray-50 p-4">
//                     <a
//                       href="##"
//                       className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
//                     >
//                       <span className="flex items-center">
//                         <span className="text-sm font-medium text-gray-900">
//                           Documentation
//                         </span>
//                       </span>
//                       <span className="block text-sm text-gray-500">
//                         Start integrating products and tools
//                       </span>
//                     </a>
//                   </div>
//                 </div>
//               </Popover.Panel>
//             </Transition>
//           </>
//         )}
//       </Popover>
//     </div>
//   );
