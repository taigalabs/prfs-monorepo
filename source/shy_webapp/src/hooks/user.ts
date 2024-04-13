import React from "react";

import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { loadLocalShyCredential } from "@/storage/shy_credential";
import { initShyCache, signInShy } from "@/state/userReducer";
import { loadLocalShyCache } from "@/storage/shy_cache";

export function useSignedInShyUser() {
  const dispatch = useAppDispatch();
  const { isCredentialInitialized, shyCredential } = useAppSelector(state => state.user);

  React.useEffect(() => {
    if (!isCredentialInitialized) {
      const credential = loadLocalShyCredential();
      dispatch(signInShy(credential));
    }
  }, [isCredentialInitialized]);

  return { isCredentialInitialized, shyCredential };
}

export function useShyCache() {
  const dispatch = useAppDispatch();
  const isCacheInitialized = useAppSelector(state => state.user.isCacheInitialized);
  const shyCache = useAppSelector(state => state.user.shyCache);

  React.useEffect(() => {
    if (!isCacheInitialized) {
      const cache = loadLocalShyCache();
      console.log("Loading local Shy cache", cache);

      dispatch(initShyCache(cache));
    }
  }, [isCacheInitialized]);

  return { isCacheInitialized, shyCache };
}
