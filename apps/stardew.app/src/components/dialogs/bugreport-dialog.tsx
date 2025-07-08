import { Turnstile } from "@marsidev/react-turnstile";
import { IconHeart } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { User } from "../top-bar";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface Props {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export const BugReportDialog = ({ open, setOpen }: Props) => {
	const api = useSWR<User>(
		"/api",
		// @ts-expect-error
		(...args) => fetch(...args).then((res) => res.json()),
		{ refreshInterval: 0, revalidateOnFocus: false },
	);

	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [id, setId] = useState("");

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<div className="flex justify-center">
					<Image
						src="https://stardewvalleywiki.com/mediawiki/images/0/05/Emote_Uh.gif"
						alt={"Uh icon"}
						width={48}
						height={48}
					/>
				</div>
				<DialogHeader>
					<DialogTitle className="text-center">File a bug report</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Something not working as expected? Let us know! We&apos;ll do our best
					to fix it.
				</DialogDescription>
				<form
					onSubmit={async (event) => {
						setLoading(true);
						event.preventDefault();
						const values = Object.fromEntries(
							new FormData(event.target as HTMLFormElement).entries(),
						);

						setLoading(true);

						const promise = fetch("/api/bug", {
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ ...values, user: api.data }),
							method: "POST",
						});

						toast.promise(promise, {
							success: () => {
								setLoading(false);
								setSubmitted(true);
								promise
									.then((res) => res.json())
									.then((data) => setId(data.identifier));
								return "Feedback sent!";
							},
							loading: "Sending feedback...",
							error: (error: Error) =>
								error?.message ?? "Something went wrong...",
						});
					}}
					className="space-y-3"
					method="POST"
					action="/api/bug"
				>
					<div className="space-y-3">
						<Label>What happened?</Label>
						<Textarea
							id="short"
							name="short"
							className="w-full"
							placeholder="Give us a short description of the problem."
						/>
					</div>
					<div className="space-y-3">
						<Label>What were you doing when this happened?</Label>
						<Textarea
							id="long"
							name="long"
							className="w-full"
							placeholder="Try to be as descriptive as possible - this helps us find the error!"
						/>
					</div>

					<Turnstile
						siteKey="0x4AAAAAAASW5x6dVsMylLaO"
						style={{ display: "none" }}
						options={{ responseFieldName: "turnstile" }}
					/>
					{!submitted && (
						<Button type="submit" disabled={loading}>
							{loading ? "Sending..." : "Send"}
						</Button>
					)}
					{submitted && (
						<div className="flex items-center justify-between rounded-md bg-red-200 p-2 text-sm font-medium transition-all hover:bg-red-300 hover:text-red-800">
							<div className="flex items-center space-x-1">
								<IconHeart className="text-red-700" />
								<p className="text-red-700">
									Thank you! Your bug report ID is {id}.
								</p>
							</div>
						</div>
					)}
				</form>
			</DialogContent>
		</Dialog>
	);
};
