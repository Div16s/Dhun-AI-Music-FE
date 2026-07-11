"use client"
import { Home, Music } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "~/lib/utils";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

const items = [
    { title: "Home", url: "/", icon: Home },
    { title: "Create", url: "/create", icon: Music }
];

export default function SidebarMenuItems() {
    const path = usePathname();

    return (
        <>
            {items.map((item) => {
                const active = path === item.url;
                return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            render={<a href={item.url} />}
                            isActive={active}
                            tooltip={item.title}
                            className={cn(
                                "h-10 rounded-full px-3",
                                !active && "hover:bg-[#161616] hover:text-zinc-200",
                            )}
                        >
                            <item.icon />
                            <span className="truncate text-base font-medium">{item.title}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </>
    );
}
