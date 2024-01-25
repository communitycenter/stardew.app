import { deleteCookie } from "cookies-next";
import { useContext, useState } from "react";

import { PlayersContext } from "@/contexts/players-context";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  type?: "player" | "account"; // if type isn't provided, it will delete all save data
  playerID?: string;
}

export const DeletionDialog = ({ open, setOpen, playerID, type }: Props) => {
  const { players } = useContext(PlayersContext);

  const selectedPlayer = players?.filter(
    (player) => player._id === playerID
  )[0];

  const [verify, setVerify] = useState("");

  let _body: any = null;

  if (type) {
    if (type === "player") {
      _body = { _id: playerID, type: "player" };
    } else {
      _body = { type: "account" };
    }
  }

  const deleteData = async () => {
    const res = await fetch("/api/saves", {
      method: "DELETE",
      body: _body ? JSON.stringify(_body) : null,
    });

    if (res.ok) {
      setOpen(false);
      // TODO: might be better to just reset the players context
      if (type === "account") {
        deleteCookie("token", {
          maxAge: 0,
          domain: parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT!)
            ? "localhost"
            : "stardew.app",
        });
        deleteCookie("uid", {
          maxAge: 0,
          domain: parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT!)
            ? "localhost"
            : "stardew.app",
        });
        deleteCookie("oauth_state", {
          maxAge: 0,
          domain: parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT!)
            ? "localhost"
            : "stardew.app",
        });
        deleteCookie("discord_user", {
          maxAge: 0,
          domain: parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT!)
            ? "localhost"
            : "stardew.app",
        });
      }
      window.location.reload();
    }
  };

  if (type && type === "account") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-bold">your entire account</span>. All of your
            save data and account information will be deleted.
          </DialogDescription>
          <DialogDescription className="space-y-1">
            To verify, type{" "}
            <span className="font-bold text-red-500">delete my account</span>{" "}
            below:
            <Input
              value={verify}
              id="verify"
              onChange={(e) => setVerify(e.target.value)}
              className="text-black dark:text-white"
            />
          </DialogDescription>
          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              onClick={() => {
                setVerify("");
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (verify === "delete my account") deleteData();
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This action cannot be undone. This will permanently delete{" "}
          {playerID ? (
            <>this farmhand&apos;s data.</>
          ) : (
            <>
              <span className="font-bold">all farmhand data</span>.
            </>
          )}
        </DialogDescription>
        <DialogDescription asChild>
          <span>
            The following farmhands will be deleted:
            <ul className="list-disc list-inside">
              {playerID ? (
                <li>
                  {`${selectedPlayer?.general?.name} - ${selectedPlayer?.general?.farmInfo}`}
                </li>
              ) : (
                <>
                  {players?.map((player) => (
                    <li key={player._id}>
                      {player.general?.name + ` - ${player.general?.farmInfo}`}
                    </li>
                  ))}
                </>
              )}
            </ul>
          </span>
        </DialogDescription>
        <DialogFooter className="gap-3 sm:gap-0">
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => deleteData()}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
