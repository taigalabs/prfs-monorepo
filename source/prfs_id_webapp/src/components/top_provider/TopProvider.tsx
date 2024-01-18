"use client";

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrfsReactComponentsI18NProvider } from "@taigalabs/prfs-react-lib/src/i18n/i18nContext";
import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
// import { publicProvider } from "wagmi/providers/public";
import { publicProvider } from "@taigalabs/prfs-web3-js/wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import { I18nProvider } from "@/i18n/context";
import { store } from "@/state/store";
import { PrfsEmbedProvider } from "@taigalabs/prfs-id-sdk-react/src/context";
import { envs } from "@/envs";

const queryClient = new QueryClient();

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

const TopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <PrfsReactComponentsI18NProvider>
          <PrfsEmbedProvider
            appId="prfs_id"
            prfsEmbedEndpoint={envs.NEXT_PUBLIC_PRFS_EMBED_WEBAPP_ENDPOINT}
          >
            <ReduxProvider store={store}>
              <I18nProvider>{children}</I18nProvider>
            </ReduxProvider>
          </PrfsEmbedProvider>
        </PrfsReactComponentsI18NProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
};

export default TopProvider;
