import React from "react";
import cn from "classnames";
import { useQuery } from "@tanstack/react-query";
import { decrypt } from "@taigalabs/prfs-crypto-js";
import { abbrevAddr } from "@taigalabs/prfs-crypto-js";
import { prfsApi2, prfsApi3 } from "@taigalabs/prfs-api-js";
import { PrfsIdCredential, WALLET_CM_STEM, makeWalletCacheKeyCm } from "@taigalabs/prfs-id-sdk-web";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";

import styles from "./CachedAddressModal.module.scss";
import { i18nContext } from "@/i18n/context";
import { useAppSelector } from "@/state/hooks";
import { hexlify } from "ethers/lib/utils";

function useCachedAddresses(prfsIdCredential: PrfsIdCredential | null) {
  const [walletCacheKeys, setWalletCacheKeys] = React.useState<string[] | null>(null);
  const queryResult = useQuery({
    queryKey: ["get_prfs_indices", walletCacheKeys],
    queryFn: async () => {
      if (walletCacheKeys) {
        // return prfsApi2("get_prfs_indices", { keys: walletCacheKeys });
        return prfsApi3({ type: "get_prfs_indices", keys: walletCacheKeys });
      }
    },
    enabled: !!walletCacheKeys,
  });

  const walletAddrs = React.useMemo<Set<string> | null>(() => {
    const { data, error } = queryResult;
    if (data) {
      if (!data.payload) {
        return null;
      }

      const { prfs_indices } = data.payload;
      if (prfs_indices && prfsIdCredential) {
        const set = new Set<string>();
        for (let key in prfs_indices) {
          try {
            const prfsIndex = prfs_indices[key];
            const buf = Buffer.from(prfsIndex.substring(2), "hex");
            const addr = decrypt(prfsIdCredential.secret_key, buf).toString();
            set.add(addr);
          } catch (err) {
            console.error(err);
          }
        }
        return set;
      }
    }

    return null;
  }, [queryResult]);

  React.useEffect(() => {
    async function fn() {
      if (prfsIdCredential) {
        const walletCacheKeys = [];
        for (let idx = 0; idx < 10; idx += 1) {
          const { hashed } = await makeWalletCacheKeyCm(prfsIdCredential.secret_key, idx);
          const key = hexlify(hashed);
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
  const i18n = React.useContext(i18nContext);

  const addrList = React.useMemo(() => {
    if (walletAddrs) {
      const elems = [];
      for (const addr of walletAddrs) {
        const address = abbrevAddr(addr);
        const handleClick = () => {
          handleChangeAddress(addr);
        };

        const el = (
          <li key={addr}>
            <Button variant="white_black_2" className={styles.itemBtn} handleClick={handleClick}>
              {address}
            </Button>
          </li>
        );
        elems.push(el);
      }
      return (
        <div>
          <p className={styles.title}>{i18n.choose_an_address}</p>
          <ul className={styles.itemList}>{elems}</ul>
        </div>
      );
    } else {
      return <div>No cached addresses to select</div>;
    }
  }, [walletAddrs]);

  return prfsIdCredential ? (
    <div className={styles.wrapper}>
      {addrList}
      <div className={styles.btnRow}>
        <div />
        <Button variant="transparent_aqua_blue_1" handleClick={handleClickClose}>
          {i18n.close}
        </Button>
      </div>
    </div>
  ) : (
    <div>Credential is empty. Something is wrong</div>
  );
};

export default CachedAddressModal;

export interface WalletModalProps {
  handleClickClose: () => void;
  handleChangeAddress: (addr: string) => void;
}
