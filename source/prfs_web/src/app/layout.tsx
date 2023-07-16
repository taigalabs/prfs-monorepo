"use client";

import "./globals.scss";
import { Roboto } from "next/font/google";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Theme, ThemeProvider, createTheme } from "@mui/material/styles";

// import { I18nContext } from "@/contexts";
import { I18nProvider } from "@/contexts/i18n";
import en from "@/i18n/en";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"]
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
            {/* <StateContext.Provider> */}
            <I18nProvider>{children}</I18nProvider>
            {/* </StateContext.Provider> */}
          </ThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
