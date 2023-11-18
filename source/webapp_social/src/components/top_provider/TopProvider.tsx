import { Provider as StateProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrfsReactComponentsI18NProvider } from "@taigalabs/prfs-react-components/src/contexts/i18nContext";
import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import { I18nProvider } from "@/contexts/i18n";
import { store } from "@/state/store";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
);

const config = createConfig({
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

const queryClient = new QueryClient();

const TopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

export default TopProvider;
