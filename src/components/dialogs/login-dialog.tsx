import Link from "next/link";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState } from "react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const LoginDialog = ({ open, setOpen }: Props) => {
  const [joinDiscord, setJoinDiscord] = useState(true);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="flex justify-center">
          <Image src="/discord.png" alt={"Heart icon"} width={48} height={48} />
        </div>
        <DialogHeader>
          <DialogDescription>
            stardew.app uses Discord to sync your saves, preferences, and stats
            across devices - nothing else!
          </DialogDescription>
          <DialogDescription>
            <div className="items-top flex space-x-2 pt-2 text-left">
              <Checkbox
                id="ccdiscord"
                defaultChecked={joinDiscord}
                onCheckedChange={(checked) => setJoinDiscord(Boolean(checked))}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="ccdiscord"
                  className="text-sm font-medium leading-none text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white"
                >
                  Join the Community Center Discord
                </label>
                <p className="text-muted-foreground text-sm">
                  We occasionally post updates, information and more in our
                  Discord server. You can leave at any time, no hard feelings!
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 sm:gap-0">
          <Button>
            <Link
              href={{
                pathname: "/api/oauth",
                query: { discord: joinDiscord },
              }}
            >
              Log In With Discord
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
