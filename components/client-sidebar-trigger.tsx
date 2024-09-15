'use client'

import { SidebarTrigger, useSidebar } from "./ui/sidebar";

export function ClientSidebarTrigger() {
  const { open } = useSidebar()

  if (open) {
    return null
  }

  return (
    <SidebarTrigger tabIndex={0} variant="secondary" />
  )
}