import React from "react";

import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { loadLocalPrfsProofCredential } from "@/storage/local_storage";
import { signInPrfs } from "@/state/userReducer";

export function useSignedInProofUser() {
  const dispatch = useAppDispatch();
  const { isInitialized, prfsProofCredential } = useAppSelector(state => state.user);

  React.useEffect(() => {
    if (!isInitialized) {
      const credential = loadLocalPrfsProofCredential();
      dispatch(signInPrfs(credential));
    }
  }, [isInitialized]);

  return { isInitialized, prfsProofCredential };
}
