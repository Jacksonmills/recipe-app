"use client"

import * as React from "react"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { VariantProps } from "class-variance-authority";

export const SIDEBAR_STATE_COOKIE = "sidebar:state"

type SidebarContext = {
  state: "open" | "closed"
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SidebarContext = React.createContext<SidebarContext>({
  state: "open",
  open: true,
  onOpenChange: () => {},
})

function useSidebar() {
  return React.useContext(SidebarContext)
}

const SidebarLayout = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
  }
>(({ defaultOpen, className, ...props }, ref) => {
  const [open, setOpen] = React.useState(defaultOpen ?? true)

  const onOpenChange = React.useCallback((open: boolean) => {
    setOpen(open)
    document.cookie = `${SIDEBAR_STATE_COOKIE}=${open}; path=/; max-age=${
      60 * 60 * 24 * 7
    }`
  }, [])

  const state = open ? "open" : "closed"

  return (
    <SidebarContext.Provider value={{ state, open, onOpenChange }}>
      <div
        ref={ref}
        data-sidebar={state}
        style={
          {
            "--sidebar-width": "16rem",
          } as React.CSSProperties
        }
        className={cn(
          "flex min-h-screen  pl-0 transition-all duration-300 ease-in-out data-[sidebar=closed]:pl-0 sm:pl-[--sidebar-width]",
          className
        )}
        {...props}
      />
    </SidebarContext.Provider>
  )
})
SidebarLayout.displayName = "SidebarLayout"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    variant?: VariantProps<typeof buttonVariants>["variant"]
  }
>(({ className, variant, ...props }, ref) => {
  const { open, onOpenChange } = useSidebar()

  return (
    <Button
      ref={ref}
      variant={variant || "ghost"}
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={() => onOpenChange(!open)}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const Sidebar = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, children }, ref) => {
    const isMobile = useIsMobile()
    const { open, onOpenChange } = useSidebar()
    const sidebarRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (sidebarRef.current) {
        const focusableElements = sidebarRef.current.querySelectorAll(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )

        focusableElements.forEach((element) => {
          if (!open) {
            (element as HTMLElement).setAttribute('tabindex', '-1')
          } else {
            (element as HTMLElement).removeAttribute('tabindex')
          }
        })
      }
    }, [open])

    const sidebar = (
      <div
        ref={ref}
        aria-hidden={!open}
        className={cn("flex h-full flex-col border-r bg-background", className)}
      >
        {children}
      </div>
    )

    if (isMobile) {
      return (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent
            className="w-[260px] p-0 md:w-[--sidebar-width] [&>button]:hidden"
            side="left"
          >
            {sidebar}
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <aside ref={sidebarRef} className="fixed inset-y-0 left-0 z-10 hidden w-[--sidebar-width] transition-all duration-300 ease-in-out md:block [[data-sidebar=closed]_&]:left-[calc(var(--sidebar-width)*-1)]">
        {sidebar}
      </aside>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center border-b p-2.5", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center border-t p-2.5", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-1 flex-col gap-5 overflow-auto py-4", className)}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("grid gap-2 px-2.5", className)} {...props} />
  )
})
SidebarItem.displayName = "SidebarItem"

const SidebarLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "px-1.5 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
})
SidebarLabel.displayName = "SidebarLabel"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarLayout,
  SidebarTrigger,
  useSidebar,
}
