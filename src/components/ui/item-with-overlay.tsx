import { ItemQuality } from "@/types/bundles";
import Image from "next/image";

const qualityStars: Record<string, string> = {
  "1": "https://stardewvalleywiki.com/mediawiki/images/e/eb/Silver_Quality.png",
  "2": "https://stardewvalleywiki.com/mediawiki/images/9/9f/Gold_Quality.png",
  "3": "https://stardewvalleywiki.com/mediawiki/images/b/bc/Iridium_Quality.png",
};

export type ItemWithOverlayProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: ItemQuality;
  quantity?: string;
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
  let star = null;
  if (quality && parseInt(quality) > 0) {
    star = (
      <Image
        src={qualityStars[quality]}
        alt={"Quality Star"}
        className={
          className ? "absolute bottom-0 left-0 rounded-sm" : className
        }
        width={16}
        height={16}
      />
    );
  }
  let number = null;
  if (quantity && parseInt(quantity) > 1) {
    number = (
      <div
        className="absolute bottom-[-.5rem] right-[-.3rem] overflow-visible bg-transparent font-['3x5'] text-[0.45rem]"
        style={{
          "text-shadow":
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
        width={width ? width : 32}
        height={height ? height : 32}
      />
      {star}
      {number}
    </div>
  );
}
