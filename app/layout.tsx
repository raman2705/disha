import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/components/AppContext";
import { DishaAssistantDrawer } from "@/components/DishaAssistantDrawer";
import { Navigation } from "@/components/Navigation";
import { AssistantLauncher } from "@/components/AssistantLauncher";
import { Walkthrough } from "@/components/Walkthrough";
import { brand } from "@/lib/data";

export const metadata: Metadata = {
  title: brand.name,
  description: brand.tagline,
  applicationName: brand.name,
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Navigation />
          <DishaAssistantDrawer />
          <main className="mx-auto max-w-7xl px-4 pb-56 pt-12 sm:px-6 sm:pt-14 lg:px-8">{children}</main>
          <AssistantLauncher />
          <Walkthrough />
        </AppProvider>
      </body>
    </html>
  );
}
