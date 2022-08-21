import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import Image from "next/image";
import logo from "../../public/icon.png";
import Link from "next/link";

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function LoginModal({ isOpen, setOpen }: Props) {
  function closeModal() {
    setOpen(false);
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/75 blur-xl" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className=" w-full max-w-md transform overflow-hidden rounded-2xl border border-gray-300 bg-[#f0f0f0] p-6 text-center align-middle shadow-xl transition-all dark:border-[#2A2A2A] dark:bg-[#191919]">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    <div className="mb-2 flex justify-center">
                      <Image
                        src={logo}
                        height={48}
                        width={48}
                        alt="Heart emoji"
                      ></Image>
                    </div>
                    Logging into Stardew.app
                  </Dialog.Title>
                  <div className="mt-2 space-y-4">
                    <p className="text-sm text-gray-500">
                      We use Discord as our primary login system - here&apos;s
                      what you get by logging in:
                    </p>
                    <p className="text-left text-sm text-gray-500">
                      <li>Synced progress across devices</li>
                      <li>Shiny role in our Discord server</li>
                      <li>Super fast support</li>
                    </p>
                    <p className="text-xs italic text-gray-500">
                      Upon logging in, you&apos;ll be added to our server - you
                      can always leave though (we won&apos;t hold it against
                      you!)
                    </p>
                  </div>

                  <div className="flex justify-center space-x-2">
                    <div className="mt-4">
                      <button
                        type="button"
                        className="rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        No thanks, maybe later...
                      </button>
                    </div>
                    <div className="mt-4">
                      <Link href="/api/oauth">
                        <button
                          type="button"
                          className="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Log into Discord
                        </button>
                      </Link>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
