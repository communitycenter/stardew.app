import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const DeletionDialog = ({ open, setOpen }: Props) => {
  const deleteData = async () => {
    const res = await fetch("/api/saves", {
      method: "DELETE",
    });

    if (res.ok) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This action cannot be undone. This will permanently delete all of your
          stored data.
        </DialogDescription>
        <DialogFooter className="gap-3 sm:gap-0">
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button disabled variant="destructive" onClick={() => deleteData()}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
