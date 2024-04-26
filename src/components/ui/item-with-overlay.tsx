import { ItemQuality } from "@/types/bundles";
import Image from "next/image";
import { parse } from "path";

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
        src={`https://cdn.stardew.app/images/quality_${quality}.webp`}
        alt={"Quality Star"}
        className={className ? "absolute left-0 top-0 rounded-sm" : className}
        width={width ? width : 32}
        height={height ? height : 32}
      />
    );
  }
  let number = null;
  if (quantity && parseInt(quantity) > 1) {
    number = (
      <div className="absolute bottom-0 right-0 rounded-tl-md bg-transparent px-1 text-xs font-bold">
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
