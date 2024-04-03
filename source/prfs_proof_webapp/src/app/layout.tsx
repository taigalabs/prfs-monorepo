import React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import "@taigalabs/prfs-react-lib/src/global.scss";

import "./globals.scss";
import TopProvider from "@/components/top_provider/TopProvider";
import { roboto } from "@/fonts";

export const metadata: Metadata = {
  robots: {
    index: true,
  },
  title: "Prfs - Create and share proofs",
  description:
    "Create and share proofs on your own. Powered by blazing-fast and secure zero-knowledge proof technology",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.className}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0 target-densitydpi=device-dpi"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* <link */}
        {/*   href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" */}
        {/*   rel="stylesheet" */}
        {/* /> */}
        {/* <link */}
        {/*   href="https://fonts.googleapis.com/css2?family=Chivo:wght@400;500;600&display=swap" */}
        {/*   rel="stylesheet" */}
        {/* /> */}
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
