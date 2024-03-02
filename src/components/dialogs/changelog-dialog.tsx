import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Image from "next/image";
import Link from "next/link";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const ChangelogDialog = ({ open, setOpen }: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="flex justify-center">
          <Image
            src="https://stardewvalleywiki.com/mediawiki/images/3/36/Emote_Exclamation.png"
            alt={"Waving icon"}
            width={48}
            height={48}
          />
        </div>
        <DialogHeader>
          <DialogTitle>stardew.app version 2.2.0 is out!</DialogTitle>
          <DialogDescription>
            <h1>
              Hey there! We just released a new version of stardew.app -
              here&apos;s a quick rundown of everything new!
            </h1>
            <br></br>
            <ul>
              <li>
                <strong>New Content</strong>
                <ul>
                  <li>
                    We now support the Stardew Valley 1.6 update! If you&apos;d
                    like to hide spoilers, you can head to{" "}
                    <Link className="underline" href="/account">
                      your account settings
                    </Link>{" "}
                    and turn off 1.6 content.
                  </li>
                </ul>
              </li>
              <br></br>
              <li>
                <strong>Improvements</strong>
                <ul>
                  <li>- Ability to sort villagers by amount of hearts</li>
                  <li>- Feedback button in account dropdown</li>
                  <li>- New mobile navigation layout</li>
                </ul>
              </li>
              <br></br>
              <li>
                <strong>Bug Fixes</strong>
                <ul>
                  <li>- Better error handling for save files</li>
                </ul>
              </li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 sm:gap-0">
          <DialogClose asChild>
            <Button variant="secondary">Looks great, thanks!</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
