import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { fontSans, fontSerif, fontWide } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Account | GRP",
  description: "Manage your GRP account.",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;
  return (
    <html lang={lng}>
      <body
        className={cn(
          "min-h-screen font-sans antialiased dark:bg-[#000014]",
          fontSans.variable,
          fontWide.variable,
          fontSerif.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen">
            <SiteHeader lng={lng} />
            <div>{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
