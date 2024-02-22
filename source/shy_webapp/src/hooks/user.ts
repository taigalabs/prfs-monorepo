import React from "react";

import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { loadLocalShyCredential } from "@/storage/local_storage";
import { signInShy } from "@/state/userReducer";

export function useSignedInShyUser() {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector(state => state.user.isInitialized);
  const shyCredential = useAppSelector(state => state.user.shyCredential);

  React.useEffect(() => {
    if (!isInitialized) {
      const credential = loadLocalShyCredential();
      dispatch(signInShy(credential));
    }
  }, [isInitialized]);

  return { isInitialized, shyCredential };
}
