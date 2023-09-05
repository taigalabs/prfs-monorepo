import React from "react";

import localStore from "@/storage/localStore";
import { AppDispatch } from "@/state/store";

const useLocalWallet = (dispatch: AppDispatch) => {
  React.useEffect(() => {
    let prfsAccount = localStore.getPrfsAccount();

    if (prfsAccount !== null) {
      dispatch({
        type: "load_prfs_account",
        payload: prfsAccount,
      });
    }
  }, []);
};

export default useLocalWallet;
