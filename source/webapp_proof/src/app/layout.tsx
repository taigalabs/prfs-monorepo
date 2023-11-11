import React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import "@taigalabs/prfs-react-components/src/react_components.scss";

import "./globals.scss";
import TopProvider from "@/components/top_provider/TopProvider";

export const metadata: Metadata = {
  title: "Prfs",
  description:
    "Create and share proofs on your own. Backed by blazing-fast and secure zero-knowledge proof technology",
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
        <link
          href="https://fonts.googleapis.com/css2?family=Chivo:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-6XJ85QPRBR" />
      <Script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-6XJ85QPRBR');
        `}
      </Script>
      <body suppressHydrationWarning={true}>
        <TopProvider>{children}</TopProvider>
      </body>
    </html>
  );
}
