"use client";

import React from "react";
import { Provider as StateProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrfsReactComponentsI18NProvider } from "@taigalabs/prfs-react-lib/src/i18n/i18nContext";
import { PrfsEmbedProvider } from "@taigalabs/prfs-id-sdk-react/src/context";
import { http, createConfig, WagmiProvider } from "@taigalabs/prfs-web3-js/wagmi";
import { mainnet, sepolia } from "@taigalabs/prfs-web3-js/wagmi/chains";

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

const TopProvider: React.FC<TopProviderProps> = ({ children, appId }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <PrfsReactComponentsI18NProvider>
          <PrfsEmbedProvider
            appId={appId}
            prfsEmbedEndpoint={envs.NEXT_PUBLIC_PRFS_EMBED_WEBAPP_ENDPOINT}
          >
            <StateProvider store={store}>
              <I18nProvider>{children}</I18nProvider>
            </StateProvider>
          </PrfsEmbedProvider>
        </PrfsReactComponentsI18NProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default TopProvider;

export interface TopProviderProps {
  children: React.ReactNode;
  appId: string;
}
