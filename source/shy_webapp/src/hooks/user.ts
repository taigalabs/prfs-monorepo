import React from "react";

import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { loadLocalShyCredential } from "@/storage/local_storage";
import { signInPrfs } from "@/state/userReducer";

export function useSignedInUser() {
  const dispatch = useAppDispatch();
  const isCredentialInitialized = useAppSelector(state => state.user.isInitialized);
  const prfsProofCredential = useAppSelector(state => state.user.shyCredential);

  React.useEffect(() => {
    if (!isCredentialInitialized) {
      const credential = loadLocalShyCredential();
      dispatch(signInPrfs(credential));
    }
  }, [isCredentialInitialized]);

  return { isCredentialInitialized, prfsProofCredential };
}
