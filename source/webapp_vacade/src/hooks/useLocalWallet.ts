import React from "react";

import localStore from "@/storage/localStore";
import { AppDispatch } from "@/state/store";
import { loadPrfsAccount } from "@/state/userReducer";

const useLocalWallet = (dispatch: AppDispatch) => {
  React.useEffect(() => {
    const localPrfsAccount = localStore.getPrfsAccount();

    dispatch(loadPrfsAccount({ localPrfsAccount }));
  }, []);
};

export default useLocalWallet;
