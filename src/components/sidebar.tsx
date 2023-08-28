import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import {
  IconHome2,
  IconHeart,
  IconFishHook,
  IconEgg,
  IconId,
  IconHammer,
  IconGardenCart,
  IconBox,
  IconShirt,
  IconAward,
  IconBrandGithub,
  IconBrandDiscord,
  IconBuildingWarehouse,
  IconBook,
  IconNote,
  IconProgress,
} from "@tabler/icons-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const miscNavigation = [
  // { name: "Bundles", href: "/bundles", icon: IconBox },
  { name: "Walnuts", href: "/island/walnuts", icon: IconProgress },
  { name: "Secret Notes", href: "/notes", icon: IconNote },
  { name: "Journal Scraps", href: "/island/scraps", icon: IconBook },
];

export const playerNavigation = [
  { name: "Home", href: "/", icon: IconHome2 },
  { name: "Farmer", href: "/farmer", icon: IconId },
  { name: "Perfection", href: "/perfection", icon: IconAward },
  { name: "Relationships", href: "/relationships", icon: IconHeart },
];

export const collectionsNavigation = [
  { name: "Cooking", href: "/cooking", icon: IconEgg },
  { name: "Crafting", href: "/crafting", icon: IconHammer },
  { name: "Fishing", href: "/fishing", icon: IconFishHook },
  { name: "Shipping", href: "/shipping", icon: IconGardenCart },
  { name: "Museum & Artifacts", href: "/museum", icon: IconBuildingWarehouse },
];

export const SidebarCategory = ({ children }: { children: string }) => (
  <h2 className="mt-4 mb-2 px-4 font-semibold tracking-tight text-neutral-700 dark:text-neutral-300">
    {children}
  </h2>
);

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={className}>
      <div className="grid grid-cols-3 pt-4 gap-2 w-72 px-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="w-full dark:hover:bg-[#5865F2] hover:bg-[#5865F2] hover:text-neutral-50"
                asChild
              >
                <a href={"/discord"} target="_blank" rel="noreferrer">
                  <IconBrandDiscord size={20} />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Join our Discord!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="w-full hover:bg-neutral-800 hover:text-neutral-50"
                asChild
              >
                <a href={"/github"} target="_blank" rel="noreferrer">
                  <IconBrandGithub size={20} />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>stardew.app&apos;s source!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="w-full hover:bg-[#FFD282] dark:hover:bg-[#FFD282] hover:text-neutral-50"
                asChild
              >
                <a
                  href={
                    "https://stardew.me/?utm_campaign=StardewApp&utm_source=Beta&utm_medium=Button"
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconShirt size={20} />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Generate a Stardew avatar!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <nav className="px-3 pb-2">
        <SidebarCategory>Player</SidebarCategory>
        <div className="space-y-1">
          {playerNavigation.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                item.href === pathname
                  ? ""
                  : "text-neutral-600 dark:text-neutral-400"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="w-4 h-4 mr-2" aria-hidden="true" />
                {item.name}
              </Link>
            </Button>
          ))}
        </div>
        <SidebarCategory>Collections</SidebarCategory>
        <div className="space-y-1">
          {collectionsNavigation.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                item.href === pathname
                  ? ""
                  : "text-neutral-600 dark:text-neutral-400"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="w-4 h-4 mr-2" aria-hidden="true" />
                {item.name}
              </Link>
            </Button>
          ))}
        </div>

        <SidebarCategory>Misc</SidebarCategory>
        <div className="space-y-1">
          {miscNavigation.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                item.href === pathname
                  ? ""
                  : "text-neutral-600 dark:text-neutral-400"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="w-4 h-4 mr-2" aria-hidden="true" />
                {item.name}
              </Link>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );
}
