import React from "react";
import { MdRefresh } from "@react-icons/all-files/md/MdRefresh";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { PrfsProof } from "@taigalabs/prfs-entities/bindings/PrfsProof";

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
import { i18nContext } from "../i18n/i18nContext";
import { defaultSnapOrigin } from "../modules/snap/config";
import { MetamaskActions, usePrfsSnap } from "../hooks/use_prfs_snap";

/**
 * MetaMask context provider to handle MetaMask and snap status.
 *
 * @param props - React Props.
 * @param props.children - React component to be wrapped by the Provider.
 * @returns JSX.
 */
const Snaps: React.FC<SnapsProps> = ({ prfsProof, setIsOpen }) => {
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
      console.log("Save to Snap", prfsProof);

      await addProof({
        proof_label: prfsProof.proof_type_id,
      });

      setIsOpen(false);
      window.alert("Proof URL is saved on Snap!");
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  }, [prfsProof, setIsOpen]);

  // console.log(111, state);

  return (
    <div className={styles.wrapper}>
      {!isMetaMaskReady ? (
        <button disabled>Snap (not supported)</button>
      ) : !state.installedSnap ? (
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
  prfsProof: PrfsProof;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
