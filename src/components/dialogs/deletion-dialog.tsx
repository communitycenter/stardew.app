import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  playerID?: string;
}

export const DeletionDialog = ({ open, setOpen, playerID }: Props) => {
  const deleteData = async () => {
    const res = await fetch("/api/saves", {
      method: "DELETE",
      body: playerID ? JSON.stringify({ _id: playerID }) : null,
    });

    if (res.ok) {
      setOpen(false);
      // TODO: might be better to just reset the players context
      window.location.reload();
    }
  };

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
