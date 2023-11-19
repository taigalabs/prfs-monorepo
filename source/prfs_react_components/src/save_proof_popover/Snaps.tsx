import React from "react";
import { MdRefresh } from "@react-icons/all-files/md/MdRefresh";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";

import styles from "./Snaps.module.scss";
import {
  addProof,
  connectSnap,
  detectSnaps,
  getSnap,
  isFlask,
  isLocalSnap,
  shouldDisplayReconnect,
} from "../modules/snap/utils";
import { i18nContext } from "../contexts/i18nContext";
import { defaultSnapOrigin } from "../modules/snap/config";
import { MetamaskActions, usePrfsSnap } from "../hooks/use_prfs_snap";

/**
 * MetaMask context provider to handle MetaMask and snap status.
 *
 * @param props - React Props.
 * @param props.children - React component to be wrapped by the Provider.
 * @returns JSX.
 */
const Snaps: React.FC<SnapsProps> = ({ proofShortUrl, proofInstance }) => {
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

  const handleClickSave = React.useCallback(async () => {
    try {
      console.log("Save to Snap", proofShortUrl, proofInstance);

      await addProof({
        proof_label: proofInstance.proof_label,
        proof_short_url: proofShortUrl,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  }, [proofShortUrl, proofInstance]);

  // console.log(111, state);

  return (
    <div className={styles.wrapper}>
      {!isMetaMaskReady && <button disabled>Snap (not supported)</button>}
      {!state.installedSnap ? (
        <button onClick={handleClickConnect}>Snap connect</button>
      ) : (
        <button onClick={handleClickSave}>
          <span>Snap</span>
          <span className={styles.beta}>{i18n.beta}</span>
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

export default Snaps;

export interface SnapsProps {
  proofShortUrl: string;
  proofInstance: PrfsProofInstanceSyn1;
}
