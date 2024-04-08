import React from "react";
import cn from "classnames";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { decrypt } from "@taigalabs/prfs-crypto-js";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import { PrfsIdCredential, WALLET_CACHE_KEY, makeAtstCm } from "@taigalabs/prfs-id-sdk-web";
import { hexlify } from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";

import styles from "./CachedAddressModal.module.scss";
import { i18nContext } from "@/i18n/context";
import { useAppSelector } from "@/state/hooks";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";

export function useCachedItems({ prfsIdCredential, prfsSet }: UseCachedItemsArgs) {
  const [cacheKeys, setCacheKeys] = React.useState<string[] | null>(null);
  const { data, error } = useQuery({
    queryKey: ["get_prfs_indices", cacheKeys],
    queryFn: async () => {
      if (cacheKeys) {
        return prfsApi3({ type: "get_prfs_indices", keys: cacheKeys });
      }
    },
    enabled: !!cacheKeys,
  });

  const walletAddrs = React.useMemo<Set<string> | null>(() => {
    if (data) {
      if (!data.payload) {
        return null;
      }

      const { prfs_indices } = data.payload;
      if (prfs_indices && prfsIdCredential) {
        const set = new Set<string>();
        for (const key in prfs_indices) {
          try {
            const prfsIndex = prfs_indices[key];
            const buf = Buffer.from(prfsIndex.substring(2), "hex");
            const addr = decrypt(prfsIdCredential.secret_key, buf).toString();
            set.add(addr);
          } catch (err) {
            console.warn("prfs index wasn't decryptable, key: %s", key);
            // console.error(err);
          }
        }
        return set;
      }
    }

    return null;
  }, [data]);

  React.useEffect(() => {
    async function fn() {
      if (prfsIdCredential) {
        const cacheKeys = [];
        for (let idx = 0; idx < 10; idx += 1) {
          switch (prfsSet.element_type) {
            case "member_id": {
              const arg = `${WALLET_CACHE_KEY}_${idx}`;
              const { hashed } = await makeAtstCm(prfsIdCredential.secret_key, arg);
              // const { hashed } = await makeWalletCacheKeyCm(prfsIdCredential.secret_key, idx);
              const key = hexlify(hashed);

              cacheKeys.push(key);
              break;
            }
            case "wallet_addr": {
              const arg = `${WALLET_CACHE_KEY}_${idx}`;
              const { hashed } = await makeAtstCm(prfsIdCredential.secret_key, arg);
              // const { hashed } = await makeWalletCacheKeyCm(prfsIdCredential.secret_key, idx);
              const key = hexlify(hashed);

              cacheKeys.push(key);
              break;
            }

            default:
              console.error("Wrong prfs set element type, type: %s", prfsSet.element_type);
          }
        }
        setCacheKeys(cacheKeys);
      }
    }
    fn().then();
  }, [prfsIdCredential]);

  return { walletAddrs };
}

export interface UseCachedItemsArgs {
  prfsIdCredential: PrfsIdCredential | null;
  prfsSet: PrfsSet;
}
