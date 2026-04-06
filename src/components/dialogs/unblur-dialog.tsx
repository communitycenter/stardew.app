import Link from "next/link";

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

interface Props {
	open: boolean;
	setOpen: (open: boolean) => void;
	toggleShow: () => boolean;
}

export const UnblurDialog = ({ open, setOpen, toggleShow }: Props) => {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Show New Content</DialogTitle>
					<DialogDescription>
						Are you sure you want to show new content? This will unblur all new
						items in the 1.6 update. You can always change this in your{" "}
						<Link
							href="/account"
							className="underline hover:text-neutral-400 hover:dark:text-neutral-300"
						>
							account settings
						</Link>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-3 sm:gap-0">
					<DialogClose asChild>
						<Button variant="secondary">Cancel</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button onClick={() => toggleShow()}>Show New Content</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
