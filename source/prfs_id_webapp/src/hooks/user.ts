import React from "react";

import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { loadLocalPrfsProofCredential } from "@/storage/local_storage";
import { signInPrfs } from "@/state/userReducer";

// export function useSignedInUser() {
//   const dispatch = useAppDispatch();
//   const isCredentialInitialized = useAppSelector(state => state.user.isInitialized);
//   const prfsProofCredential = useAppSelector(state => state.user.prfsProofCredential);

//   React.useEffect(() => {
//     if (!isCredentialInitialized) {
//       const credential = loadLocalPrfsProofCredential();
//       dispatch(signInPrfs(credential));
//     }
//   }, [isCredentialInitialized]);

//   return { isCredentialInitialized, prfsProofCredential };
// }
