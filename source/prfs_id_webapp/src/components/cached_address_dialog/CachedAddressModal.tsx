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
  const queryResult = useQuery({
    queryKey: ["get_prfs_indices", walletCacheKeys],
    queryFn: async () => {
      if (walletCacheKeys) {
        return prfsApi2("get_prfs_indices", { keys: walletCacheKeys });
      }
    },
    enabled: !!walletCacheKeys,
  });

  const walletAddrs = React.useMemo<string[] | null>(() => {
    const { data, error } = queryResult;
    if (data) {
      if (!data.payload) {
        return null;
      }

      const { prfs_indices } = data.payload;
      if (prfs_indices && prfsIdCredential) {
        const ret = [];
        for (let key in prfs_indices) {
          try {
            const prfsIndex = prfs_indices[key];
            const buf = Buffer.from(prfsIndex.substring(2), "hex");
            const addr = decrypt(prfsIdCredential.secret_key, buf).toString();
            ret.push(addr);
          } catch (err) {
            console.error(err);
          }
        }
        return ret;
      }
    }

    return null;
  }, [queryResult]);

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

  return { walletAddrs };
}

const CachedAddressModal: React.FC<WalletModalProps> = ({
  handleClickClose,
  handleChangeAddress,
}) => {
  const prfsIdCredential = useAppSelector(state => state.user.prfsIdCredential);
  const { walletAddrs } = useCachedAddresses(prfsIdCredential);

  const addrList = React.useMemo(() => {
    if (walletAddrs) {
      const elems = [];
      for (const addr of walletAddrs) {
        const el = <div key={addr}>{addr}</div>;
        elems.push(el);
      }
      return <ul>{elems}</ul>;
    } else {
      return <div>No cached addresses to select</div>;
    }
  }, [walletAddrs]);

  return prfsIdCredential ? (
    <div className={styles.wrapper}>
      {addrList}
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
