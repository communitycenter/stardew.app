import { useContext, useState } from "react";

import { PlayersContext } from "@/contexts/players-context";
import { clearClientAuthCookies } from "@/lib/client-env";

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
import { toast } from "sonner";

interface Props {
	open: boolean;
	setOpen: (open: boolean) => void;
	type?: "player" | "account"; // if type isn't provided, it will delete all save data
	playerID?: string;
}

export const DeletionDialog = ({ open, setOpen, playerID, type }: Props) => {
	const { deletePlayers, players } = useContext(PlayersContext);

	const selectedPlayer = players?.filter(
		(player) => player._id === playerID,
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
		try {
			if (type === "account") {
				const res = await fetch("/api/saves", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ type: "account" }),
				});

				if (!res.ok) {
					throw new Error(`Failed to delete account: ${res.status}`);
				}

				setOpen(false);
				clearClientAuthCookies();
				window.location.href = "/";
				return;
			}

			await deletePlayers(type === "player" ? playerID : undefined);
			setOpen(false);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to delete save data.",
			);
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
						<ul className="list-inside list-disc">
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
