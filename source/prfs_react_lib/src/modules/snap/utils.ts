import type { MetaMaskInpageProvider } from "@metamask/providers";
import { PrfsProofSnapItem } from "@taigalabs/prfs-entities/bindings/PrfsProofSnapItem";

import { defaultSnapOrigin } from "./config";
import type { GetSnapsResponse, Snap } from "./types";

/**
 * Get the installed snaps in MetaMask.
 *
 * @param provider - The MetaMask inpage provider.
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (provider?: MetaMaskInpageProvider): Promise<GetSnapsResponse> =>
  (await (provider ?? window.ethereum).request({
    method: "wallet_getSnaps",
  })) as unknown as GetSnapsResponse;
/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<"version" | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: "wallet_requestSnaps",
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      snap => snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (error) {
    console.log("Failed to obtain installed snap", error);
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

export const sendHello = async () => {
  await window.ethereum.request({
    method: "wallet_invokeSnap",
    params: { snapId: defaultSnapOrigin, request: { method: "hello" } },
  });
};

export const addProof = async (proof: PrfsProofSnapItem) => {
  await window.ethereum.request({
    method: "wallet_invokeSnap",
    params: {
      snapId: defaultSnapOrigin,
      request: { method: "add_proof", params: { proof } },
    },
  });
};

export const getProofs = async () => {
  const res = await window.ethereum.request({
    method: "wallet_invokeSnap",
    params: {
      snapId: defaultSnapOrigin,
      request: { method: "get_proofs" },
    },
  });

  console.log(123, res);

  return res;
};

export const isLocalSnap = (snapId: string) => snapId.startsWith("local:");

export const shouldDisplayReconnect = (installedSnap?: Snap) => {
  return installedSnap && isLocalSnap(installedSnap?.id);
};

/**
 * Tries to detect if one of the injected providers is MetaMask and checks if snaps is available in that MetaMask version.
 *
 * @returns True if the MetaMask version supports Snaps, false otherwise.
 */
export const detectSnaps = async () => {
  if (window.ethereum?.detected) {
    for (const provider of window.ethereum.detected) {
      try {
        // Detect snaps support
        await getSnaps(provider);

        // enforces MetaMask as provider
        if (window.ethereum.setProvider) {
          window.ethereum.setProvider(provider);
        }

        return true;
      } catch {
        // no-op
      }
    }
  }

  if (window.ethereum?.providers) {
    for (const provider of window.ethereum.providers) {
      try {
        // Detect snaps support
        await getSnaps(provider);

        window.ethereum = provider;

        return true;
      } catch {
        // no-op
      }
    }
  }

  try {
    await getSnaps();

    return true;
  } catch {
    return false;
  }
};

/**
 * Detect if the wallet injecting the ethereum object is MetaMask Flask.
 *
 * @returns True if the MetaMask version is Flask, false otherwise.
 */
export const isFlask = async () => {
  const provider = window.ethereum;

  try {
    const clientVersion = await provider?.request({
      method: "web3_clientVersion",
    });

    const isFlaskDetected = (clientVersion as string[])?.includes("flask");

    return Boolean(provider && isFlaskDetected);
  } catch {
    return false;
  }
};
