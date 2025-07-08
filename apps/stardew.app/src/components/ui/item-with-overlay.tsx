import { ItemQuality } from "@/types/bundles";
import Image from "next/image";

const qualityStars: Record<string, string> = {
	"1": "https://cdn.stardew.app/images/(MISC)Silver_Quality.webp",
	"2": "https://cdn.stardew.app/images/(MISC)Gold_Quality.webp",
	"3": "https://cdn.stardew.app/images/(MISC)Iridium_Quality.webp",
};

export type ItemWithOverlayProps = {
	src: string;
	alt: string;
	className?: string;
	width?: number;
	height?: number;
	quality?: ItemQuality;
	quantity?: number;
};

export default function ItemWithOverlay({
	src,
	alt,
	className,
	width,
	height,
	quality,
	quantity,
}: ItemWithOverlayProps) {
	const targetWidth = width ? width : 32;
	const targetHeight = height ? height : 32;
	const starSize = Math.min(targetWidth, targetHeight) / 2;
	const bottomPull = starSize / 2;
	const rightPull = bottomPull / 2;
	let star = null;
	if (quality && parseInt(quality) > 0) {
		star = (
			<Image
				src={qualityStars[quality]}
				alt={"Quality Star"}
				className={
					className ? "absolute bottom-0 left-0 rounded-sm " : className
				}
				width={starSize}
				height={starSize}
			/>
		);
	}
	let number = null;
	if (quantity && quantity > 1) {
		number = (
			<div
				className={`absolute overflow-visible bg-transparent font-['3x5'] text-white`}
				style={{
					bottom: `-${bottomPull}px`,
					right: `-${rightPull}px`,
					fontSize: `${bottomPull}px`,
					textShadow:
						"-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
				}}
			>
				{quantity}
			</div>
		);
	}
	return (
		<div className="relative">
			<Image
				src={src}
				alt={alt}
				className={className ? "rounded-sm" : className}
				width={targetWidth}
				height={targetHeight}
			/>
			{star}
			{number}
		</div>
	);
}
