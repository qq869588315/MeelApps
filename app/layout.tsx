import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Meel Apps",
    template: "%s · Meel Apps"
  },
  description: "Personal apps and tools by Meel."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const umamiScript = process.env.UMAMI_SCRIPT_URL;
  const umamiWebsiteId = process.env.UMAMI_WEBSITE_ID;
  return (
    <html lang="zh">
      <body>
        {children}
        {umamiScript && umamiWebsiteId ? (
          <script defer src={umamiScript} data-website-id={umamiWebsiteId} />
        ) : null}
      </body>
    </html>
  );
}
