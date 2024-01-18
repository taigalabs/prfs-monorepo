"use client";

import React from "react";
import { Provider as StateProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrfsReactComponentsI18NProvider } from "@taigalabs/prfs-react-lib/src/i18n/i18nContext";
// import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
// import { publicProvider } from "wagmi/providers/public";
// import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
// import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { PrfsEmbedProvider } from "@taigalabs/prfs-id-sdk-react/src/context";

import { http, createConfig, WagmiProvider } from "@taigalabs/prfs-web3-js/wagmi";
import { mainnet, sepolia } from "@taigalabs/prfs-web3-js/wagmi/chains";

import { I18nProvider } from "@/i18n/context";
import { store } from "@/state/store";
import { envs } from "@/envs";

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

// const { chains, publicClient, webSocketPublicClient } = configureChains(
//   [mainnet],
//   [publicProvider()],
// );

// const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors: [
//     new MetaMaskConnector({ chains }),
//     new CoinbaseWalletConnector({
//       chains,
//       options: {
//         appName: "wagmi",
//       },
//     }),
//   ],
//   publicClient,
//   webSocketPublicClient,
// });

const TopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <PrfsReactComponentsI18NProvider>
          <PrfsEmbedProvider
            appId="prfs_proof"
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
