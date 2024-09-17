'use client';

import { History, House, Settings2, SquareTerminal, Star } from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Image from 'next/image';
const data = {
  navMain: [
    {
      title: 'Navigation',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'home',
          url: '/',
        },
      ],
    },
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: 'vercel/ai streaming',
          url: '/vercel-ai-streaming',
        },
        {
          title: 'vercel/ai',
          url: '/vercel-ai',
        },
        {
          title: 'streaming',
          url: '/streaming',
        },
        {
          title: 'synchronous',
          url: '/synchronous',
        },
      ],
    },
  ],
};

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="pt-0">
        <SidebarHeader>
          <SidebarTrigger className="m-2.5" />
        </SidebarHeader>
        <SidebarItem>
          <NavMain items={data.navMain} />
        </SidebarItem>
      </SidebarContent>
    </Sidebar>
  );
}
