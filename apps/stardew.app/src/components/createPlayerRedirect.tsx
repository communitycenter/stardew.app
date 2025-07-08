import { IconExternalLink, IconPencil } from "@tabler/icons-react";
import Link from "next/link";

export const CreatePlayerRedirect = () => {
	return (
		<Link href="/editor/create">
			<div className="bg-blue-200 p-2 rounded-md flex justify-between items-center text-sm font-medium hover:bg-blue-300 transition-all hover:text-blue-800">
				<div className="flex items-center space-x-1">
					<IconPencil className="text-blue-700" />
					<p className="text-blue-700">
						Create a character to begin editing stats.
					</p>
				</div>
				<div>
					<IconExternalLink className="text-blue-700 font-medium" />
				</div>
			</div>
		</Link>
	);
};
