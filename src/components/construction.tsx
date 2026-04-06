import Image from "next/image";

export const Construction = () => {
	return (
		<div className="block items-center justify-center space-x-4 sm:flex">
			<h1 className="text-center text-2xl font-bold text-neutral-900 dark:text-neutral-100">
				This page is under construction, please check back later!
			</h1>
			<div className="flex justify-center">
				<Image
					src="/construction.gif"
					alt="Robin GIF"
					width={64}
					height={128}
					quality={100}
				/>
			</div>
		</div>
	);
};
