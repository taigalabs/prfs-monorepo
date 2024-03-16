import React from "react";

import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { loadLocalPrfsProofCredential } from "@/storage/local_storage";
import { signInPrfs } from "@/state/userReducer";

export function useSignedInProofUser() {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector(state => state.user.isInitialized);
  const prfsProofCredential = useAppSelector(state => state.user.prfsProofCredential);

  React.useEffect(() => {
    if (!isInitialized) {
      const credential = loadLocalPrfsProofCredential();
      dispatch(signInPrfs(credential));
    }
  }, [isInitialized]);

  return { isInitialized, prfsProofCredential };
}
