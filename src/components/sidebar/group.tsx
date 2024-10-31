import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import React from "react";

interface CustomSidebarGroupProps {
  label?: string;
  items: { name: string; href: string; icon: (props: any) => JSX.Element }[];
  pathname: string;
  className?: string;
}

const CustomSidebarGroup = ({
  label,
  items,
  pathname,
  className = "",
}: CustomSidebarGroupProps) => (
  <SidebarGroup className={className}>
    {label && (
      <SidebarGroupLabel className="text-sm font-medium">
        {label}
      </SidebarGroupLabel>
    )}
    <SidebarGroupContent>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={item.name}
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);

export default CustomSidebarGroup;
