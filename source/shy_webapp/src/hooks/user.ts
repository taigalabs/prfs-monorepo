import React from "react";

import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { loadLocalShyCredential } from "@/storage/shy_credential";
import { initShyCache, signInShy } from "@/state/userReducer";
import { loadLocalShyCache } from "@/storage/shy_cache";

export function useSignedInShyUser() {
  const dispatch = useAppDispatch();
  const isCredentialInitialized = useAppSelector(state => state.user.isCredentialInitialized);
  const shyCredential = useAppSelector(state => state.user.shyCredential);

  React.useEffect(() => {
    if (!isCredentialInitialized) {
      const credential = loadLocalShyCredential();
      dispatch(signInShy(credential));
    }
  }, [isCredentialInitialized]);

  return { isCredentialInitialized, shyCredential };
}

export function useLocalShyCache() {
  const dispatch = useAppDispatch();
  const isCacheInitialized = useAppSelector(state => state.user.isCacheInitialized);

  React.useEffect(() => {
    if (isCacheInitialized) {
      const cache = loadLocalShyCache();
      dispatch(initShyCache(cache));
    }
  }, [isCacheInitialized]);
}
