import { IconExternalLink, IconPencil } from "@tabler/icons-react";
import Link from "next/link";

export const CreatePlayerRedirect = () => {
	return (
		<Link href="/editor/create">
			<div className="flex items-center justify-between rounded-md bg-blue-200 p-2 text-sm font-medium transition-all hover:bg-blue-300 hover:text-blue-800">
				<div className="flex items-center space-x-1">
					<IconPencil className="text-blue-700" />
					<p className="text-blue-700">
						Create a character to begin editing stats.
					</p>
				</div>
				<div>
					<IconExternalLink className="font-medium text-blue-700" />
				</div>
			</div>
		</Link>
	);
};
