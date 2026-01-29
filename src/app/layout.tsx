import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { I18nProvider } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import VisitTracker from "@/components/VisitTracker";

export const metadata: Metadata = {
  title: "Madagascar Turtle Conservation NGO",
  description: "Official platform for turtle protection and conservation in Madagascar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="bd492751-bbb2-4296-9351-6b26737eb5c7"
        />
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <I18nProvider>
          <VisitTracker />
          <Navbar />
          {children}
        </I18nProvider>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
