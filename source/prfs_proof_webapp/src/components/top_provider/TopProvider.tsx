"use client";

import React from "react";
import { Provider as StateProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@taigalabs/prfs-react-lib/react_query";
import { PrfsReactComponentsI18NProvider } from "@taigalabs/prfs-react-lib/src/i18n/i18nContext";
import { http, createConfig, WagmiProvider } from "@taigalabs/prfs-crypto-deps-js/wagmi";
import { mainnet, sepolia } from "@taigalabs/prfs-crypto-deps-js/wagmi/chains";

import { I18nProvider } from "@/i18n/context";
import { store } from "@/state/store";
import { envs } from "@/envs";

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

const TopProvider: React.FC<TopProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <PrfsReactComponentsI18NProvider>
          <StateProvider store={store}>
            <I18nProvider>{children}</I18nProvider>
          </StateProvider>
        </PrfsReactComponentsI18NProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default TopProvider;

export interface TopProviderProps {
  children: React.ReactNode;
}
