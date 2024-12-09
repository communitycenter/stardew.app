import * as React from "react";
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  Sidebar,
  SidebarFooter,
  useSidebar,
} from "../ui/sidebar";
import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  IconBox,
  IconProgress,
  IconNote,
  IconBook,
  IconSettings,
  IconHome2,
  IconId,
  IconStars,
  IconAward,
  IconHeart,
  IconEgg,
  IconHammer,
  IconFishHook,
  IconGardenCart,
  IconBuildingWarehouse,
  IconShirt,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  ChevronsUpDown,
  Sparkles,
  BadgeCheck,
  CreditCard,
  Bell,
  LogOut,
  User,
  Plus,
  Upload,
  CheckIcon,
  Settings,
  MessageCircleIcon,
  Bug,
  NewspaperIcon,
  BugIcon,
} from "lucide-react";
import useSWR from "swr";
import { PlayersContext } from "@/contexts/players-context";
import { UploadDialog } from "../dialogs/upload-dialog";
import { LoginDialog } from "../dialogs/login-dialog";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BugReportDialog } from "../dialogs/bugreport-dialog";
import { ChangelogDialog } from "../dialogs/changelog-dialog";
import { FeedbackDialog } from "../dialogs/feedback-dialog";
import { SidebarUser } from "./user";
import CustomSidebarGroup from "./group";
import SidebarLinks from "./group";

export const miscNavigation = [
  { name: "Bundles", href: "/bundles", icon: IconBox },
  { name: "Walnuts", href: "/island/walnuts", icon: IconProgress },
  { name: "Secret Notes", href: "/notes", icon: IconNote },
  { name: "Journal Scraps", href: "/island/scraps", icon: IconBook },
];

export const playerNavigation = [
  { name: "Home", href: "/", icon: IconHome2 },
  { name: "Farmer", href: "/farmer", icon: IconId },
  { name: "Skills & Mastery", href: "/skills", icon: IconStars },
  { name: "Perfection", href: "/perfection", icon: IconAward },
  { name: "Relationships", href: "/relationships", icon: IconHeart },
  // { name: "Animals", href: "/animals", icon: IconPaw }, // Promise!
];

export const collectionsNavigation = [
  { name: "Cooking", href: "/cooking", icon: IconEgg },
  { name: "Crafting", href: "/crafting", icon: IconHammer },
  { name: "Fishing", href: "/fishing", icon: IconFishHook },
  { name: "Shipping", href: "/shipping", icon: IconGardenCart },
  { name: "Museum & Artifacts", href: "/museum", icon: IconBuildingWarehouse },
];

export const linksNavigation = [
  {
    name: "Discord",
    href: "/discord",
    icon: (props: any) => <DiscordLogoIcon {...props} />,
  },
  {
    name: "GitHub",
    href: "/github",
    icon: (props: any) => <GitHubLogoIcon {...props} />,
  },
  {
    name: "stardew.me",
    href: "https://stardew.me/?utm_campaign=StardewApp&utm_source=Beta&utm_medium=Button",
    icon: (props: any) => <IconShirt {...props} />,
  },
];

interface User {
  id: string;
  discord_id: string;
  cookie_secret: string;
  discord_avatar: string;
  discord_name: string;
}

export function AppSidebar({ ...props }) {
  const api = useSWR<User>(
    "/api",
    // @ts-expect-error
    (...args) => fetch(...args).then((res) => res.json()),
    { refreshInterval: 0, revalidateOnFocus: false },
  );

  const { players, activePlayer, uploadPlayers, setActivePlayer } =
    React.useContext(PlayersContext);

  // get a unique list of all the values for player.general.farmInfo
  const farmNames: string[] = React.useMemo(() => {
    if (!players) return [];
    const farmNames = players.map((player: any) => player.general.farmInfo);
    // turn it into a set for unique values
    const uniqueFarmNames = new Set(farmNames);
    return Array.from(uniqueFarmNames);
  }, [players]);

  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);
  const [changelogOpen, setChangelogOpen] = React.useState(false);
  const [bugreportOpen, setBugreportOpen] = React.useState(false);

  const pathname = usePathname();

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="border-r border-neutral-200 dark:border-neutral-800"
        {...props}
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="pointer-events-none">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={`/favicon.png`} />
                </Avatar>
                <div className="text-md grid flex-1 text-left font-bold leading-tight">
                  <span className="truncate">stardew.app</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="size-8 flex aspect-square items-center justify-center rounded-lg">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={`/farmer.png`} />
                      </Avatar>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {activePlayer?.general?.name ?? "Load a farmhand..."}
                      </span>
                      <span className="truncate text-xs">
                        {activePlayer?.general?.farmInfo ??
                          "Click here to upload or create!"}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto" size={16} />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="min-w-[--radix-dropdown-menu-trigger-width] rounded-lg"
                  align="start"
                  side="right"
                  sideOffset={4}
                >
                  {farmNames.length > 0 &&
                    farmNames.map((farmName) => (
                      <>
                        <DropdownMenuLabel className="text-muted-foreground text-sm">
                          {farmName}
                        </DropdownMenuLabel>
                        <DropdownMenuGroup key={farmName}>
                          {players
                            ?.filter(
                              (p: any) => p.general?.farmInfo === farmName,
                            )
                            .map((player: any) => (
                              <DropdownMenuItem
                                key={player._id}
                                onClick={() => {
                                  setActivePlayer(player);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={`/farmer.png`} />
                                  </Avatar>
                                  <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate">
                                      {player.general?.name ??
                                        "Unnamed Farmhand"}
                                      <span className="hidden">
                                        {player._id}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    activePlayer?._id == player._id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                      </>
                    ))}
                  <DropdownMenuItem
                    onClick={() => setUploadOpen(true)}
                    className="gap-2 p-2"
                  >
                    <Upload size={16} />
                    <div className="text-muted-foreground font-medium">
                      Upload a save
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 p-2">
                    <Plus size={16} />
                    <div className="text-muted-foreground font-medium">
                      Create new farmhand
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarLinks
            label="Navigation"
            items={playerNavigation}
            pathname={pathname}
          />
          <SidebarLinks
            label="Collections"
            items={collectionsNavigation}
            pathname={pathname}
          />
          <SidebarLinks
            label="Tools"
            items={miscNavigation}
            pathname={pathname}
          />
          <SidebarLinks
            className="mt-auto"
            items={linksNavigation}
            pathname={pathname}
          />
        </SidebarContent>
        <SidebarFooter className="shrink-0">
          <SidebarUser
            user={api.data}
            login={setLoginOpen}
            bugReport={setBugreportOpen}
            changelog={setChangelogOpen}
            feedback={setFeedbackOpen}
          />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <UploadDialog open={uploadOpen} setOpen={setUploadOpen} />
      <LoginDialog open={loginOpen} setOpen={setLoginOpen} />
      <FeedbackDialog open={feedbackOpen} setOpen={setFeedbackOpen} />
      <ChangelogDialog open={changelogOpen} setOpen={setChangelogOpen} />
      <BugReportDialog open={bugreportOpen} setOpen={setBugreportOpen} />
    </>
  );
}
