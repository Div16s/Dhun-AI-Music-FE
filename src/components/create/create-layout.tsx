"use client";

import type { ReactNode } from "react";

import { useIsMobile } from "~/hooks/use-mobile";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";

export function CreateLayout({
  panel,
  list,
}: {
  panel: ReactNode;
  list: ReactNode;
}) {
  const isMobile = useIsMobile();

  // Mobile: stack vertically and scroll the whole thing as one page —
  // song panel on top, track list below.
  if (isMobile) {
    return (
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="shrink-0 border-b">{panel}</div>
        <div className="shrink-0">{list}</div>
      </div>
    );
  }

  // Desktop: side-by-side with a draggable divider.
  return (
    <ResizablePanelGroup orientation="horizontal" className="h-full">
      {/* Sizes are percentage strings (no unit = %). */}
      <ResizablePanel defaultSize="28" minSize="20" maxSize="45">
        {panel}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="72" minSize="40">
        {list}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
