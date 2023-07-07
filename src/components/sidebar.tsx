import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import { HomeIcon, PersonIcon } from "@radix-ui/react-icons";

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
  const pathname = usePathname();

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            keep or remove
          </h2>
          <div className="space-y-1">
            {navigation.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
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
      </div>
    </div>
  );
}
