import "@taigalabs/prfs-react-lib/src/global.scss";
import "./globals.scss";

import React from "react";
import { Metadata } from "next/types";

import TopProvider from "@/components/top_provider/TopProvider";
import styles from "./layout.module.scss";
import { roboto } from "@/fonts";

export const metadata: Metadata = {
  robots: {
    index: true,
  },
  title: "Shy | More honest discussions",
  description: "Civilized discussions backed by zero-knowledge proof",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.className}>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning={true}>
        <TopProvider>{children}</TopProvider>
        <span className={styles.fontLoadText} />
      </body>
    </html>
  );
}
