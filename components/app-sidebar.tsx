"use client"

import {
  History,
  Settings2,
  SquareTerminal,
  Star,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
const data = {
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "vercel/ai",
          url: "/vercel-ai",
          icon: History,
          description: "View your recent prompts",
        },
        {
          title: "vercel/ai-streaming",
          url: "/vercel-ai-streaming",
          icon: History,
          description: "View your recent prompts",
        },
        {
          title: "synchronous",
          url: "/synchronous",
          icon: Star,
          description: "Browse your starred prompts",
        },
        {
          title: "streaming",
          url: "/streaming",
          icon: Settings2,
          description: "Configure your playground",
        },
      ],
    },
  ],
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="pt-0">
        <SidebarHeader>
          <SidebarTrigger className="m-2" />
        </SidebarHeader>
        <SidebarItem>
          <NavMain items={data.navMain} />
        </SidebarItem>
      </SidebarContent>
    </Sidebar>
  )
}
