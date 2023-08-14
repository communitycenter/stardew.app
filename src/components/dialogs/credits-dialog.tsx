import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const CreditsDialog = ({ open, setOpen }: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="flex justify-center">
          <Image
            src="https://stardewvalleywiki.com/mediawiki/images/c/c8/Emojis043.png"
            alt={"Heart icon"}
            width={48}
            height={48}
          />
        </div>
        <DialogHeader>
          <DialogTitle className="text-center">Credits</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          stardew.app was developed, designed, and created by{" "}
          <a href="https://jack.bio" className="underline">
            Jack LaFond
          </a>{" "}
          and{" "}
          <a href="https://solorio.dev" className="underline">
            Clemente Solorio
          </a>
          .
        </DialogDescription>
        <DialogDescription>
          However, it wouldn&apos;t be possible without the help of the{" "}
          <a href="https://solorio.dev" className="underline">
            Leah Lundqvist
          </a>{" "}
          (backend),{" "}
          <a href="https://solorio.dev" className="underline">
            Brandon Saldan
          </a>{" "}
          (frontend), and our countless contributors on{" "}
          <a href="https://stardew.app/github" className="underline">
            GitHub
          </a>
          .
        </DialogDescription>
        <DialogHeader>
          <DialogTitle className="text-sm">Notable Mentions</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <li>Stardew Valley Wiki</li>
          <li>Stardew Valley&apos;s Discord #seasoned-farmers</li>
          <li>ConcernedApe</li>
          <li>You, the user - thank you!</li>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
