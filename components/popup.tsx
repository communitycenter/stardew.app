import { useState } from "react";
import { deleteCookie } from "cookies-next";
import Image from "next/image";

import * as Popover from "@radix-ui/react-popover";

import CreditsModal from "./modals/credits";
import DeletionModal from "./modals/deletion";

interface Props {
  user: any;
}

export default function Popup({ user }: Props) {
  const [showCreditsSlideover, setShowCreditsSlideover] =
    useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  return (
    <>
      <Popover.Root>
        <div className="flex-1">
          <Popover.Trigger asChild>
            <div className="group flex w-full items-center rounded-md border bg-gray-100 py-4 px-5 text-base text-black hover:cursor-pointer dark:border-[#2a2a2a] dark:bg-[#1f1f1f] dark:text-white hover:dark:bg-[#191919]">
              <div className="flex space-x-2">
                <Image
                  className="mr-3 h-5 w-5 flex-shrink-0 rounded-2xl text-black dark:text-white"
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
            </div>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content asChild>
              <div className="z-50 mr-24 mb-2 w-full divide-y divide-[#2A2A2A] rounded-md border bg-gray-100 font-medium shadow-md drop-shadow-lg transition focus:outline-none dark:border-[#2a2a2a] dark:bg-[#1F1F1F] dark:text-white sm:mr-8">
                <div className="flex justify-between px-4 py-3">
                  <p className="text-right text-sm text-[#7D7D7D]">
                    stardew.app
                  </p>
                  <p className="text-right text-sm text-[#7D7D7D]">v0.0.1</p>
                </div>
                <div className="py-1 font-normal">
                  <div>
                    <div
                      onClick={() => setShowCreditsSlideover(true)}
                      className="group flex items-center rounded-md py-2 px-5 text-base font-normal text-[#7D7D7D] hover:cursor-pointer hover:bg-gray-50 hover:text-black dark:border-[#2A2A2A]  dark:bg-[#1F1F1F] dark:hover:bg-[#141414] hover:dark:text-white"
                    >
                      Credits
                    </div>
                  </div>
                  <div>
                    <div
                      onClick={() => setShowDeleteModal(true)}
                      className="group flex items-center rounded-md py-2 px-5 text-base font-normal text-[#7D7D7D] hover:cursor-pointer hover:bg-gray-50 hover:text-black dark:border-[#2A2A2A] dark:bg-[#1F1F1F] dark:hover:bg-[#141414] hover:dark:text-white"
                    >
                      Delete uploaded data
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <div
                    onClick={() => {
                      deleteCookie("token", {
                        maxAge: 0,
                        domain: process.env.NEXT_PUBLIC_DEVELOPMENT
                          ? "localhost"
                          : "stardew.app",
                      });
                      deleteCookie("uid", {
                        maxAge: 0,
                        domain: process.env.NEXT_PUBLIC_DEVELOPMENT
                          ? "localhost"
                          : "stardew.app",
                      });
                      deleteCookie("oauth_state", {
                        maxAge: 0,
                        domain: process.env.NEXT_PUBLIC_DEVELOPMENT
                          ? "localhost"
                          : "stardew.app",
                      });
                      deleteCookie("discord_user", {
                        maxAge: 0,
                        domain: process.env.NEXT_PUBLIC_DEVELOPMENT
                          ? "localhost"
                          : "stardew.app",
                      });
                      return (window.location.href = "/");
                    }}
                    className="group flex w-full items-center rounded-md py-2 px-5 text-base font-normal text-[#7D7D7D] hover:cursor-pointer hover:bg-gray-50 hover:text-black dark:border-[#2A2A2A]  dark:bg-[#1F1F1F] dark:hover:bg-[#141414] hover:dark:text-white"
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
      <DeletionModal isOpen={showDeleteModal} setOpen={setShowDeleteModal} />
    </>
  );
}
