import React from "react";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { decrypt } from "@taigalabs/prfs-crypto-js";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { PrfsIdCredential, makeWalletCacheKeyCm } from "@taigalabs/prfs-id-sdk-web";
import { hexlify } from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";

export function useCachedAddresses(prfsIdCredential: PrfsIdCredential | null) {
  const [walletCacheKeys, setWalletCacheKeys] = React.useState<string[] | null>(null);
  const { data, error } = useQuery({
    queryKey: ["get_prfs_indices", walletCacheKeys],
    queryFn: async () => {
      if (walletCacheKeys) {
        return prfsApi3({ type: "get_prfs_indices", keys: walletCacheKeys });
      }
    },
    enabled: !!walletCacheKeys,
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
