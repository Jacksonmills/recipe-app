'use client';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { NavMainItem } from './app-sidebar';

export function NavMain({
  className,
  items,
}: {
  items: NavMainItem[];
} & React.ComponentProps<'ul'>) {
  return (
    <ul className={cn('grid gap-0.5', className)}>
      {items.map((item) => (
        <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
          <li>
            <div className="relative flex items-center">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="group w-full p-0 pr-1.5">
                  <div className="min-w-8 flex h-8 flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-sm font-medium outline-none ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2">
                    <div className="flex flex-1 overflow-hidden">
                      <div className="line-clamp-1 pr-6">{item.title}</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-all focus-visible:ring-2 group-data-[state=open]:rotate-90" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="px-4 py-0.5">
              <ul className="grid border-l px-2">
                {item.items?.map((subItem) => (
                  <li key={subItem.title}>
                    <Link
                      href={subItem.url}
                      className="min-w-8 flex h-8 items-center gap-2 overflow-hidden rounded-md px-2 text-sm font-medium text-muted-foreground ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2"
                    >
                      <div className="line-clamp-1">{subItem.title}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </li>
        </Collapsible>
      ))}
    </ul>
  );
}
