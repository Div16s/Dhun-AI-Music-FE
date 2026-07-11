import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import { Providers } from "~/components/providers";
import { Toaster } from "~/components/ui/sonner";

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
      <body className="min-h-svh flex flex-col">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
