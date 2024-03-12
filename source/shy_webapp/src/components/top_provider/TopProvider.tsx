"use client";

import { Provider as StateProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@taigalabs/prfs-react-lib/react_query";
import { PrfsReactComponentsI18NProvider } from "@taigalabs/prfs-react-lib/src/i18n/i18nContext";
import { http, createConfig, WagmiProvider } from "@taigalabs/prfs-crypto-deps-js/wagmi";
import { mainnet, sepolia } from "@taigalabs/prfs-crypto-deps-js/wagmi/chains";

import { I18nProvider } from "@/i18n";
import { store } from "@/state/store";

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const TopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
