import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import {
  DiscordLogoIcon,
  GitHubLogoIcon,
  HeartFilledIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";

import { HomeIcon, UserIcon } from "@heroicons/react/24/solid";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

function FishHookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("icon icon-tabler icon-tabler-fish-hook", className)}
      width={24}
      height={24}
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M16 9v6a5 5 0 0 1 -10 0v-4l3 3"></path>
      <path d="M16 7m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
      <path d="M16 5v-2"></path>
    </svg>
  );
}

function EggIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("icon icon-tabler icon-tabler-egg-filled", className)}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path
        d="M12.002 2c-4.173 -.008 -8.002 6.058 -8.002 12.083c0 4.708 3.25 7.917 8 7.917c4.727 -.206 8 -3.328 8 -7.917c0 -6.02 -3.825 -12.075 -7.998 -12.083z"
        stroke-width="0"
        fill="currentColor"
      ></path>
    </svg>
  );
}

const miscNavigation = [
  { name: "Bundles", href: "/bundles", icon: UserIcon },
  { name: "Walnuts", href: "/island/walnuts", icon: UserIcon },
  { name: "Secret Notes", href: "/island/notes", icon: UserIcon },
  { name: "Journal Scraps", href: "/island/scraps", icon: UserIcon },
];

const playerNavigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Farmer", href: "/farmer", icon: UserIcon },
  { name: "Perfection", href: "/perfection", icon: StarFilledIcon },
  { name: "Relationships", href: "/relationships", icon: HeartFilledIcon },
];

const collectionsNavigation = [
  { name: "Cooking", href: "/cooking", icon: EggIcon },
  { name: "Crafting", href: "/crafting", icon: UserIcon },
  { name: "Fishing", href: "/fishing", icon: FishHookIcon },
  { name: "Shipping", href: "/shipping", icon: UserIcon },
  { name: "Museum & Artifacts", href: "/museum", icon: UserIcon },
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
