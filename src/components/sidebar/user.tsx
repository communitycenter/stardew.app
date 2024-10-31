import { DiscordLogoIcon } from "@radix-ui/react-icons";
import {
  ChevronsUpDown,
  Settings,
  MessageCircleIcon,
  BugIcon,
  NewspaperIcon,
  LogOut,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface User {
  id: string;
  discord_id: string;
  cookie_secret: string;
  discord_avatar: string;
  discord_name: string;
}

interface SidebarUserProps {
  user: User | undefined;
  login: (open: boolean) => void;
  feedback: (open: boolean) => void;
  bugReport: (open: boolean) => void;
  changelog: (open: boolean) => void;
}

export function SidebarUser({
  user,
  login,
  feedback,
  bugReport,
  changelog,
}: SidebarUserProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* If the user isn't logged in */}
        {!user?.discord_id && (
          <SidebarMenuButton
            asChild
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            data-umami-event="Log in"
            onClick={() => {
              login(true);
            }}
          >
            <div className="flex">
              <DiscordLogoIcon className="h-4 w-4" aria-hidden="true" />
              Log in with Discord
            </div>
          </SidebarMenuButton>
        )}

        {/* If the user is logged in */}
        {user?.discord_id && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.discord_avatar ? (
                    <AvatarImage
                      src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.discord_avatar}.png`}
                    />
                  ) : (
                    <AvatarImage
                      src={`https://cdn.discordapp.com/embed/avatars/0.png`}
                    />
                  )}
                  <AvatarFallback delayMs={600}>
                    {user?.discord_name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate">{user.discord_name}</span>
                </div>
                <ChevronsUpDown className="size-4 ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-[--radix-dropdown-menu-trigger-width] rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <SidebarMenuButton>
                  <Settings size={16} />
                  Settings
                </SidebarMenuButton>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <SidebarMenuButton onClick={() => feedback(true)}>
                  <MessageCircleIcon size={16} />
                  Feedback
                </SidebarMenuButton>
                <SidebarMenuButton onClick={() => bugReport(true)}>
                  <BugIcon size={16} />
                  Bug Report
                </SidebarMenuButton>
                <SidebarMenuButton onClick={() => changelog(true)}>
                  <NewspaperIcon size={16} />
                  Changelog
                </SidebarMenuButton>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <SidebarMenuButton>
                <LogOut size={16} />
                Log out
              </SidebarMenuButton>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
