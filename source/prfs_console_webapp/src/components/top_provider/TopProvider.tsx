"use client";

import React from "react";
// import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Provider as StateProvider } from "react-redux";
import { PrfsReactComponentsI18NProvider } from "@taigalabs/prfs-react-components/src/i18n/i18nContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { I18nProvider } from "@/i18n/context";
import { store } from "@/state/store";

const queryClient = new QueryClient();

const TopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ThirdwebProvider activeChain="ethereum"> */}
      <StateProvider store={store}>
        <PrfsReactComponentsI18NProvider>
          <I18nProvider>{children}</I18nProvider>
        </PrfsReactComponentsI18NProvider>
      </StateProvider>
      {/* </ThirdwebProvider> */}
    </QueryClientProvider>
  );
};

export default TopProvider;
