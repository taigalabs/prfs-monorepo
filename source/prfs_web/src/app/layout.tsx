"use client";

import "./globals.scss";
import { ThirdwebProvider } from "@thirdweb-dev/react";

import { I18nProvider } from "@/contexts/i18n";
import { StateProvider } from "@/contexts/state";

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
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <ThirdwebProvider activeChain="ethereum">
          <StateProvider>
            <I18nProvider>{children}</I18nProvider>
          </StateProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
