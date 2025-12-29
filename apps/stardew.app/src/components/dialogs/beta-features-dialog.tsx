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
	toggleBetaFeatures: () => boolean;
}

export const BetaFeaturesDialog = ({
	open,
	setOpen,
	toggleBetaFeatures,
}: Props) => {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Show Beta Features</DialogTitle>
					<DialogDescription>
						This feature is currently in beta and will likely change often
						based on feedback. You can always disable beta features again in
						your{" "}
						<Link
							href="/account"
							className="underline hover:text-neutral-400 hover:dark:text-neutral-300"
						>
							account settings
						</Link>
						.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-3 sm:gap-0">
					<DialogClose asChild>
						<Button variant="secondary">Cancel</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button onClick={() => toggleBetaFeatures()}>
							Show Beta Features
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

