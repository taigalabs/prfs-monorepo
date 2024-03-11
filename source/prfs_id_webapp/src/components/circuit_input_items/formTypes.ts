import { CachedProveReceipt } from "@taigalabs/prfs-driver-interface";
import React from "react";

export type FormValues<T> = {
  [Key in keyof T]: undefined | T[Key];
};

export type FormErrors<T> = {
  [Key in keyof T]: undefined | React.ReactNode;
};

export type FormHandler = (formValues: FormValues<any>) => Promise<
  | {
      isValid: false;
    }
  | {
      isValid: true;
      proofAction: string;
      proofActionSigMsg: Uint8Array;
      proofActionSig: string;
    }
>;

export type HandleSkipCreateProof = (proveReceipt: CachedProveReceipt) => void;
