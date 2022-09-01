import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function CreditsModal({ isOpen, setOpen }: Props) {
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
                      {/* <Image
                        src={logo}
                        height={48}
                        width={48}
                        alt="Heart emoji"
                      ></Image> */}
                    </div>
                    Credits
                  </Dialog.Title>
                  <div className="mt-2 space-y-4">
                    <p className="text-sm text-gray-500">
                      Stardew.app was created by{" "}
                      <a
                        className="underline"
                        href="https://twitter.com/laf0nd"
                      >
                        Jack LaFond
                      </a>{" "}
                      and{" "}
                      <a
                        className="underline"
                        href="https://twitter.com/clxmente"
                      >
                        Clemente Solorio
                      </a>{" "}
                      - however, we&apos;ve had some incredible help from
                      contributors over on our{" "}
                      <a href="https://github.com/stardewapp/stardew.app">
                        GitHub
                      </a>
                      .
                    </p>
                    <p className="text-sm text-gray-500">
                      A huge thanks especially to Leah Lundqvist, Mustafa
                      Mohamed, Conor Byrne, Ian Mitchell and Brandon Saldan for
                      contributions that got the site to where it is today.
                    </p>
                    <h3 className="space-y-4 text-sm font-medium leading-6 text-gray-900 dark:text-white">
                      Notable Mentions
                      <p className="text-sm font-normal text-gray-500">
                        Stardew.app would not have been possible without the
                        Stardew Valley Wiki, as well as MouseyPound&apos;s
                        contributions on Stardew Checkup.
                      </p>
                      <p className="text-sm font-normal text-gray-500">
                        A huge incredible thank you to the wonderful Stardew
                        Valley Discord community (especially the seasoned
                        farmers), where many questions on design styles,
                        usability, and other website related testing was done.
                        The site would not be as quality without the help of the
                        community.
                      </p>
                    </h3>

                    <p className="text-xs italic text-gray-500">
                      Stardew.app uses assets and information from
                      ConcernedApe&apos;s hit game Stardew Valley - all rights
                      reserved.
                    </p>
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
