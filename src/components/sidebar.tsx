import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { HomeIcon, PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Farmer", href: "/farmer", icon: PersonIcon },
  { name: "Fishing", href: "/fishing", icon: PersonIcon },
  { name: "Perfection", href: "/perfection", icon: PersonIcon },
  { name: "Cooking", href: "/cooking", icon: PersonIcon },
  { name: "Crafting", href: "/crafting", icon: PersonIcon },
  { name: "Shipping", href: "/shipping", icon: PersonIcon },
  { name: "Family & Social", href: "/social", icon: PersonIcon },
  { name: "Museum & Artifacts", href: "/artifacts", icon: PersonIcon },
  { name: "Bundles", href: "/bundles", icon: PersonIcon },
];

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            keep or remove
          </h2>
          {navigation.map((item) => (
            <Link key="{item.name}" href={item.href}>
              <Button
                variant={item.name === "Home" ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start space-y-1",
                  item.name === "Home" ? "text-black" : "text-[#7D7D7D]"
                )}
              >
                <item.icon
                  className={cn(
                    item.name === "Home"
                      ? "mr-2 h-h w-4 text-black dark:text-white"
                      : "mr-2 h-h w-4  hover:text-white "
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
