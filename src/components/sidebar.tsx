import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import {
  DiscordLogoIcon,
  GitHubLogoIcon,
  HeartFilledIcon,
  HomeIcon,
  PersonIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const miscNavigation = [
  { name: "Bundles", href: "/bundles", icon: PersonIcon },
  { name: "Walnuts", href: "/island/walnuts", icon: PersonIcon },
  { name: "Secret Notes", href: "/island/notes", icon: PersonIcon },
  { name: "Journal Scraps", href: "/island/scraps", icon: PersonIcon },
];

const playerNavigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Farmer", href: "/farmer", icon: PersonIcon },
  { name: "Perfection", href: "/perfection", icon: StarFilledIcon },
  { name: "Relationships", href: "/relationships", icon: HeartFilledIcon },
];

const collectionsNavigation = [
  { name: "Cooking", href: "/cooking", icon: PersonIcon },
  { name: "Crafting", href: "/crafting", icon: PersonIcon },
  { name: "Shipping", href: "/shipping", icon: PersonIcon },
  { name: "Fishing", href: "/fishing", icon: PersonIcon },
  { name: "Museum & Artifacts", href: "/museum", icon: PersonIcon },
];

const SidebarCategory = ({ children }: { children: string }) => (
  <h2 className="mt-4 mb-2 px-4 font-semibold tracking-tight text-neutral-700 dark:text-neutral-300">
    {children}
  </h2>
);

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4">
        <div className="px-3 py-2">
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
        </div>
        <div className="grid grid-cols-2 pb-4 gap-2 fixed bottom-0 w-72 px-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full dark:hover:bg-[#5865F2] hover:bg-[#5865F2] hover:text-neutral-50"
                  asChild
                >
                  <Link href={"/discord"}>
                    <DiscordLogoIcon />
                  </Link>
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
                  <Link href={"/github"}>
                    <GitHubLogoIcon />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>stardew.app&apos;s source!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
