"use client";

import "./globals.scss";
import { Roboto } from "next/font/google";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { I18nProvider } from "@/contexts/i18n";
import { StateProvider } from "@/contexts/state";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

const theme = createTheme({});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className={roboto.className} suppressHydrationWarning={true}>
        <ThemeProvider theme={theme}>
          <ThirdwebProvider activeChain="ethereum">
            <StateProvider>
              <I18nProvider>{children}</I18nProvider>
            </StateProvider>
          </ThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
