"use server"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "~/components/ui/sidebar"
import { Logo } from "~/components/logo"
import SidebarMenuItems from "./sidebar-menu-items"
import { Credits } from "./credit"
import { UserButton } from "../auth/user/user-button"
import Upgrade from "./upgrade"
import { CustomerPortalItem } from "./customer-portal-item"

export async function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 overflow-hidden px-1 transition-[gap,padding] duration-200 ease-linear group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Logo
            size={48}
            className="size-12 shrink-0 transition-[width,height] duration-200 ease-linear group-data-[collapsible=icon]:size-10"
          />
          <span className="font-heading max-w-40 overflow-hidden text-2xl font-bold whitespace-nowrap text-sidebar-foreground transition-all duration-200 ease-linear group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
            Dhun AI
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              <SidebarMenuItems />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-2 border-t border-sidebar-border">
        <div className="flex items-center justify-between gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-3 py-2 text-sm group-data-[collapsible=icon]:hidden">
          <div className="flex items-baseline gap-1.5">
            <Credits />
          </div>
          <Upgrade />
        </div>
        <UserButton
          variant="outline"
          links={[<CustomerPortalItem key="billing" />]}
          className="group-data-[collapsible=icon]:hidden"
        />
        <UserButton
          size="icon"
          links={[<CustomerPortalItem key="billing" />]}
          className="mx-auto hidden group-data-[collapsible=icon]:flex"
        />
      </SidebarFooter>
    </Sidebar>
  )
}
