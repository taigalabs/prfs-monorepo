import React from "react";

import { Snap } from "../modules/snap/types";
import { detectSnaps, getSnap, isFlask, isLocalSnap } from "../modules/snap/utils";

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

export enum MetamaskActions {
  SetInstalled = "SetInstalled",
  SetSnapsDetected = "SetSnapsDetected",
  SetError = "SetError",
  SetIsFlask = "SetIsFlask",
}

const reducer: React.Reducer<MetamaskState, MetamaskDispatch> = (state, action) => {
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

export function usePrfsSnap() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  // Find MetaMask Provider and search for Snaps
  // Also checks if MetaMask version is Flask
  React.useEffect(() => {
    const setSnapsCompatibility = async () => {
      dispatch({
        type: MetamaskActions.SetSnapsDetected,
        payload: await detectSnaps(),
      });
    };

    setSnapsCompatibility().catch(console.error);
  }, [window.ethereum]);

  // Set installed snaps
  React.useEffect(() => {
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

  React.useEffect(() => {
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

  return { state, dispatch };
}
