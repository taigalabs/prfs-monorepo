import React from "react";
import cn from "classnames";
import { useQuery } from "@tanstack/react-query";
import { decrypt, makeCommitment } from "@taigalabs/prfs-crypto-js";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsIdCredential, WALLET_CM_STEM } from "@taigalabs/prfs-id-sdk-web";

import styles from "./CachedAddressModal.module.scss";
import { i18nContext } from "@/i18n/context";
import { useAppSelector } from "@/state/hooks";

function useCachedAddresses(prfsIdCredential: PrfsIdCredential | null) {
  const [walletCacheKeys, setWalletCacheKeys] = React.useState<string[] | null>(null);
  // const [walletAddrs, setWalletAddrs] = React.useState(null);
  const addr = React.useMemo(() => {
    if (walletCacheKeys && prfsIdCredential) {
      for (let key of walletCacheKeys) {
        try {
          const buf = Buffer.from(key.substring(2), "hex");
          const addr = decrypt(prfsIdCredential.secret_key, buf);
          console.log(123, key, buf, addr);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }, [walletCacheKeys]);

  const queryResult = useQuery({
    queryKey: ["get_prfs_indices", walletCacheKeys],
    queryFn: async () => {
      if (walletCacheKeys) {
        return prfsApi2("get_prfs_indices", { keys: walletCacheKeys });
      }
    },
    enabled: !!walletCacheKeys,
  });

  React.useEffect(() => {
    async function fn() {
      if (prfsIdCredential) {
        const walletCacheKeys = [];
        for (let idx = 0; idx < 10; idx += 1) {
          const key = await makeCommitment(prfsIdCredential.secret_key, `${WALLET_CM_STEM}_${idx}`);
          walletCacheKeys.push(key);
        }
        setWalletCacheKeys(walletCacheKeys);
      }
    }
    fn().then();
  }, [prfsIdCredential]);

  return { walletCacheKeys, queryResult };
}

const CachedAddressModal: React.FC<WalletModalProps> = ({
  handleClickClose,
  handleChangeAddress,
}) => {
  const prfsIdCredential = useAppSelector(state => state.user.prfsIdCredential);
  const { walletCacheKeys, queryResult } = useCachedAddresses(prfsIdCredential);
  const { data } = queryResult;

  // console.log(22, walletCacheKeys, data);

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
