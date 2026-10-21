import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GiftNest | Thoughtful gifts, closer connections",
    template: "%s | GiftNest",
  },
  description:
    "A little thought goes a long way. Discover what your favorite people love, share wishlists, and make every gift feel personal.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
