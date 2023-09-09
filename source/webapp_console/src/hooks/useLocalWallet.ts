import React from "react";

import localStore from "@/storage/localStore";
import { AppDispatch } from "@/state/store";
import { loadPrfsAccount } from "@/state/userReducer";

const useLocalWallet = (dispatch: AppDispatch) => {
  React.useEffect(() => {
    let localPrfsAccount = localStore.getPrfsAccount();

    if (localPrfsAccount !== null) {
      dispatch(loadPrfsAccount({ localPrfsAccount }));
    }
  }, []);
};

export default useLocalWallet;
