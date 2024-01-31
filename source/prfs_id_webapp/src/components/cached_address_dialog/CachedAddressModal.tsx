import React from "react";
import cn from "classnames";
import { abbrevAddr } from "@taigalabs/prfs-web3-js";
import { useQuery } from "@tanstack/react-query";

import styles from "./CachedAddressModal.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  PrfsIdCredential,
  WALLET_CACHE_KEY,
  makeCmCacheKeyQueries,
} from "@taigalabs/prfs-id-sdk-web";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { makeCommitment } from "@taigalabs/prfs-crypto-js";
import { prfsApi2 } from "@taigalabs/prfs-api-js";

function useCachedAddresses(walletCacheKeys: string[]) {
  return useQuery({
    queryKey: ["get_prfs_indices", walletCacheKeys],
    queryFn: async () => {
      const data = await prfsApi2("get_prfs_indices", { offset });
      return data.payload ? data.payload.shy_channels : null;
    },
    enabled: walletCacheKeys.length > 0,
  });
}

const CachedAddressModal: React.FC<WalletModalProps> = ({
  handleClickClose,
  handleChangeAddress,
}) => {
  const prfsIdCredential = useAppSelector(state => state.user.prfsIdCredential);
  const [walletCacheKeys, setWalletCacheKeys] = React.useState<string[]>([]);
  const addresses = useCachedAddresses(walletCacheKeys);

  React.useEffect(() => {
    async function fn() {
      if (prfsIdCredential) {
        const walletCacheKeys = [];
        for (let idx = 0; idx < 10; idx += 1) {
          const key = await makeCommitment(
            prfsIdCredential.secret_key,
            `${WALLET_CACHE_KEY}_${idx}`,
          );
          walletCacheKeys.push(key);
        }
        setWalletCacheKeys(walletCacheKeys);
      }
    }
    fn().then();
  }, [prfsIdCredential]);

  return prfsIdCredential ? (
    <div className={styles.wrapper}>
      <div>power</div>
      {/* {isConnected && connector ? ( */}
      {/*   <ConnectedInfo */}
      {/*     ensName={ensName} */}
      {/*     address={address} */}
      {/*     connector={connector} */}
      {/*     handleChangeAddress={handleChangeAddress} */}
      {/*     handleClickDisconnect={handleClickDisconnect} */}
      {/*     handleClickClose={handleClickClose} */}
      {/*   /> */}
      {/* ) : ( */}
      {/*   connectorsElem */}
      {/* )} */}
      <div></div>
    </div>
  ) : (
    <div>Credential is empty. Something is wrong</div>
  );
};

export default CachedAddressModal;

export interface WalletModalProps {
  handleClickClose: () => void;
  handleChangeAddress: (addr: any) => void;
  // credential: PrfsIdCredential;
}
