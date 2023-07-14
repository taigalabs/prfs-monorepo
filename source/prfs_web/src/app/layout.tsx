"use client";

import "./globals.css";
import { Roboto } from "next/font/google";
import { ThirdwebProvider } from "@thirdweb-dev/react";

import { I18nContext } from "@/contexts";
import en from "@/i18n/en.json";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"]
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className={roboto.className} suppressHydrationWarning={true}>
        <ThirdwebProvider activeChain="ethereum">
          <I18nContext.Provider value={en}>{children}</I18nContext.Provider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
