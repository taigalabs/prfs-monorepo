import "@taigalabs/prfs-react-lib/src/global.scss";
import "./globals.scss";

import React from "react";
import { Metadata } from "next/types";

import TopProvider from "@/components/top_provider/TopProvider";

export const metadata: Metadata = {
  robots: {
    index: true,
  },
  title: "Shy",
  description: "Next generation social",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <TopProvider>{children}</TopProvider>
      </body>
    </html>
  );
}
