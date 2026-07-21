import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import { Providers } from "~/components/providers";
import { Toaster } from "~/components/ui/sonner";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/sidebar/app-sidebar";
import { Separator } from "@base-ui/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb";
import BreadcrumbPageClient from "~/components/sidebar/breadcrumb-page-client";

export const metadata: Metadata = {
  title: {
    default: "Dhun AI — Create Music with AI",
    template: "%s · Dhun AI",
  },
  description:
    "Dhun AI turns your ideas into original music in seconds. Generate studio-quality songs, beats, and soundtracks from a simple text prompt — no instruments, no experience required.",
  keywords: [
    "AI music generator",
    "AI song generator",
    "text to music",
    "AI music",
    "generate music with AI",
    "Dhun AI",
  ],
  metadataBase: new URL("https://dhun.ai"),
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${spaceGrotesk.variable} dark`}
      suppressHydrationWarning
    >
      <body className="flex min-h-svh flex-col">
        <Providers>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "14rem",
                "--sidebar-width-icon": "4rem",
              } as React.CSSProperties
            }
          >
            <AppSidebar />
            <SidebarInset className="flex h-screen min-w-0 flex-col">
              <header className="bg-background sticky-top z-10 border-b px-4 py-2">
                <div className="flex shrink-0 grow items-center gap-2">
                  <SidebarTrigger className="-ml-1" />
                  <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                  />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbPageClient />
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>
              <main className="flex-1 overflow-y-auto">{children}</main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
