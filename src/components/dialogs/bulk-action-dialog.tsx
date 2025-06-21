import { usePlayers } from "@/contexts/players-context";
import { useMultiSelect } from "@/contexts/multi-select-context";
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
  type: "cooking" | "crafting" | "shipping" | "museum" | "fishing";
  onBulkAction?: (
    status: number | null,
    selectedItems: Set<string>,
    close: () => void,
  ) => void;
}

export const BulkActionDialog = ({
  open,
  setOpen,
  type,
  onBulkAction,
}: Props) => {
  const { selectedItems, clearSelection } = useMultiSelect();
  const { activePlayer, patchPlayer } = usePlayers();

  const close = () => {
    clearSelection();
    setOpen(false);
  };

  const handleBulkAction = async (status: number | null) => {
    if (onBulkAction) {
      onBulkAction(status, selectedItems, close);
      return;
    }
    if (!activePlayer) return;

    const patch: any = {};
    const items = Array.from(selectedItems);

    switch (type) {
      case "cooking":
        patch.cooking = {
          recipes: Object.fromEntries(items.map((id) => [id, status])),
        };
        break;
      case "crafting":
        patch.crafting = {
          recipes: Object.fromEntries(items.map((id) => [id, status])),
        };
        break;
      case "shipping":
        patch.shipping = {
          shipped: Object.fromEntries(items.map((id) => [id, status])),
        };
        break;
      case "museum":
        patch.museum = {
          donated: Object.fromEntries(items.map((id) => [id, status])),
        };
        break;
    }

    await patchPlayer(patch);
    close();
  };

  let foundLabel = "Set All Selected as Completed";
  let notFoundLabel = "Set All Selected as Incomplete";
  if (type === "museum") {
    foundLabel = "Set All Selected as Donated";
    notFoundLabel = "Set All Selected as Not Donated";
  } else if (type === "shipping") {
    foundLabel = "Set All Selected as Shipped";
    notFoundLabel = "Set All Selected as Unshipped";
  } else if (type === "fishing") {
    foundLabel = "Set All Selected as Caught";
    notFoundLabel = "Set All Selected as Uncaught";
  }

  if (type === "museum" || type === "shipping" || type === "fishing") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Action</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Button
              variant="secondary"
              onClick={() => handleBulkAction(2)}
              disabled={selectedItems.size === 0}
            >
              {foundLabel}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleBulkAction(0)}
              disabled={selectedItems.size === 0}
            >
              {notFoundLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (type === "cooking" || type === "crafting") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Action</DialogTitle>
            <DialogDescription>
              {selectedItems.size} items selected
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                onClick={() => handleBulkAction(null)}
                disabled={!activePlayer}
              >
                Set Unknown
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkAction(1)}
                disabled={!activePlayer}
              >
                Set Known
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkAction(2)}
                disabled={!activePlayer}
              >
                Set Completed
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
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
          <DialogTitle>Bulk Action</DialogTitle>
          <DialogDescription>
            {selectedItems.size} items selected
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              onClick={() => handleBulkAction(null)}
              disabled={!activePlayer}
            >
              Set Unknown
            </Button>
            <Button
              variant="outline"
              onClick={() => handleBulkAction(1)}
              disabled={!activePlayer}
            >
              Set Known
            </Button>
            <Button
              variant="outline"
              onClick={() => handleBulkAction(2)}
              disabled={!activePlayer}
            >
              Set Completed
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
