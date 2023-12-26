import React from "react";
import { MdRefresh } from "@react-icons/all-files/md/MdRefresh";
import {
  connectSnap,
  getProofs,
  getSnap,
  isLocalSnap,
  shouldDisplayReconnect,
} from "@taigalabs/prfs-react-components/src/modules/snap/utils";
import {
  MetamaskActions,
  usePrfsSnap,
} from "@taigalabs/prfs-react-components/src/hooks/use_prfs_snap";
import { defaultSnapOrigin } from "@taigalabs/prfs-react-components/src/modules/snap/config";

import styles from "./OpenSnapDialog.module.scss";
import { i18nContext } from "@/contexts/i18n";

const OpenSnapDialog: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  const { state, dispatch } = usePrfsSnap();
  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin) ? state.isFlask : state.snapsDetected;

  const handleClickConnect = React.useCallback(async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  }, []);

  const handleClickOpen = React.useCallback(async () => {
    try {
      console.log("Open Snap dialog");

      await getProofs();
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  }, []);

  // console.log(111, state);

  return (
    <div className={styles.wrapper}>
      {!isMetaMaskReady && <button disabled>Snap (not supported)</button>}
      {!state.installedSnap ? (
        <button className={styles.snapBtn} onClick={handleClickConnect}>
          Snap connect
        </button>
      ) : (
        <button className={styles.snapBtn} onClick={handleClickOpen}>
          MetaMask Snap Simulation
        </button>
      )}
      {shouldDisplayReconnect(state.installedSnap) && (
        <button className={styles.reconnectBtn} onClick={handleClickConnect}>
          <MdRefresh />
        </button>
      )}
    </div>
  );
};

export default OpenSnapDialog;
