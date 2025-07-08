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
import { Textarea } from "../ui/textarea";

interface Props {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export const FeedbackDialog = ({ open, setOpen }: Props) => {
	const api = useSWR<User>(
		"/api",
		// @ts-expect-error
		(...args) => fetch(...args).then((res) => res.json()),
		{ refreshInterval: 0, revalidateOnFocus: false },
	);

	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<div className="flex justify-center">
					<Image
						src="https://stardewvalleywiki.com/mediawiki/images/4/49/Emote_Hi%21.gif"
						alt={"Waving icon"}
						width={48}
						height={48}
					/>
				</div>
				<DialogHeader>
					<DialogTitle className="text-center">Feedback</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					stardew.app is created for the community, by the community - we&apos;d
					love to hear your feedback!
				</DialogDescription>
				<form
					onSubmit={async (event) => {
						setLoading(true);
						event.preventDefault();
						const values = Object.fromEntries(
							new FormData(event.target as HTMLFormElement).entries(),
						);

						setLoading(true);

						const promise = fetch("/api/feedback", {
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ ...values, user: api.data }),
							method: "POST",
						});

						toast.promise(promise, {
							success: () => {
								setLoading(false);
								setSubmitted(true);
								return "Feedback sent!";
							},
							loading: "Sending feedback...",
							error: (error: Error) =>
								error?.message ?? "Something went wrong...",
						});
					}}
					className="space-y-6"
					method="POST"
					action="/api/contact"
				>
					<Textarea
						id="body"
						name="body"
						className="w-full"
						placeholder="What would you like to see in the site? New feature? New page? Let us know!"
					/>
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
									Thank you so much for the feedback! We&apos;ll reach out if we
									have any questions.
								</p>
							</div>
						</div>
					)}
				</form>
			</DialogContent>
		</Dialog>
	);
};
