import type { Dispatch, ReactNode, Reducer } from 'react';
import React, { createContext, useEffect, useReducer } from 'react';
// import { MdOutlineRefresh } from "react-icons/sru";
import { MdRefresh } from "@react-icons/all-files/md/MdRefresh";

import styles from './Snaps.module.scss';
import type { Snap } from '../modules/snap/types';
import { addProof, connectSnap, detectSnaps, getSnap, isFlask, isLocalSnap, shouldDisplayReconnect } from '../modules/snap/utils';
import { i18nContext } from '../contexts/i18nContext';
import { defaultSnapOrigin } from '../modules/snap/config';

export type MetamaskState = {
  snapsDetected: boolean;
  isFlask: boolean;
  installedSnap?: Snap;
  error?: Error;
};

const initialState: MetamaskState = {
  snapsDetected: false,
  isFlask: false,
};

type MetamaskDispatch = { type: MetamaskActions; payload: any };

export const MetaMaskContext = createContext<
  [MetamaskState, Dispatch<MetamaskDispatch>]
>([
  initialState,
  () => {
    /* no op */
  },
]);

export enum MetamaskActions {
  SetInstalled = 'SetInstalled',
  SetSnapsDetected = 'SetSnapsDetected',
  SetError = 'SetError',
  SetIsFlask = 'SetIsFlask',
}

const reducer: Reducer<MetamaskState, MetamaskDispatch> = (state, action) => {
  switch (action.type) {
    case MetamaskActions.SetInstalled:
      return {
        ...state,
        installedSnap: action.payload,
      };

    case MetamaskActions.SetSnapsDetected:
      return {
        ...state,
        snapsDetected: action.payload,
      };
    case MetamaskActions.SetIsFlask:
      return {
        ...state,
        isFlask: action.payload,
      };
    case MetamaskActions.SetError:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

/**
 * MetaMask context provider to handle MetaMask and snap status.
 *
 * @param props - React Props.
 * @param props.children - React component to be wrapped by the Provider.
 * @returns JSX.
 */
const Snaps = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const i18n = React.useContext(i18nContext);

  // Find MetaMask Provider and search for Snaps
  // Also checks if MetaMask version is Flask
  useEffect(() => {
    const setSnapsCompatibility = async () => {
      dispatch({
        type: MetamaskActions.SetSnapsDetected,
        payload: await detectSnaps(),
      });
    };

    setSnapsCompatibility().catch(console.error);
  }, [window.ethereum]);

  // Set installed snaps
  useEffect(() => {
    /**
     * Detect if a snap is installed and set it in the state.
     */
    async function detectSnapInstalled() {
      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: await getSnap(),
      });
    }

    const checkIfFlask = async () => {
      dispatch({
        type: MetamaskActions.SetIsFlask,
        payload: await isFlask(),
      });
    };

    if (state.snapsDetected) {
      detectSnapInstalled().catch(console.error);
      checkIfFlask().catch(console.error);
    }
  }, [state.snapsDetected]);

  useEffect(() => {
    let timeoutId: number;

    if (state.error) {
      timeoutId = window.setTimeout(() => {
        dispatch({
          type: MetamaskActions.SetError,
          payload: undefined,
        });
      }, 10000);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [state.error]);

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;

  const handleConnectClick = React.useCallback(async () => {
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
      await addProof();
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }

  }, []);

  // console.log(111, state);

  return (
    <div className={styles.wrapper}>
      {!isMetaMaskReady && (
        <button disabled>
          Snap (not supported)
        </button>
      )}
      {!state.installedSnap ? (
        <button onClick={handleConnectClick}>Snap connect</button>
      ) : (
        <button onClick={handleClickSave}>
          <span>Snap</span>
          <span className={styles.beta}>{i18n.beta}</span>
        </button>
      )}
      {shouldDisplayReconnect(state.installedSnap) && (
        <button className={styles.reconnectBtn} onClick={handleConnectClick}>
          <MdRefresh />
        </button>
      )}
    </div>
  )
};

export default Snaps;
