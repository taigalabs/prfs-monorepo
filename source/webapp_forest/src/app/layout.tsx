"use client";

import "@taigalabs/prfs-react-components/src/react_components.scss";
import "./globals.scss";

import React from "react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Provider as StateProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrfsReactComponentsI18NProvider } from "@taigalabs/prfs-react-components/src/contexts/i18nContext";

import { I18nProvider } from "@/contexts/i18n";
import { store } from "@/state/store";

const queryClient = new QueryClient();

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
      </head>
      <body suppressHydrationWarning={true}>
        <ParentProvider>{children}</ParentProvider>
      </body>
    </html>
  );
}

const ParentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThirdwebProvider activeChain="ethereum">
      <QueryClientProvider client={queryClient}>
        <PrfsReactComponentsI18NProvider>
          <StateProvider store={store}>
            <I18nProvider>{children}</I18nProvider>
          </StateProvider>
        </PrfsReactComponentsI18NProvider>
      </QueryClientProvider>
    </ThirdwebProvider>
  );
};
