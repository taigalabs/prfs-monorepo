import React from "react";
import { toUtf8Bytes } from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";
import { PrfsIdCredential, deriveProofKey } from "@taigalabs/prfs-id-sdk-web";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
import { Wallet } from "@taigalabs/prfs-crypto-deps-js/ethers";
import { SimpleHashV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/SimpleHashV1Inputs";
import { SimpleHashV1Data } from "@taigalabs/prfs-circuit-interface/bindings/SimpleHashV1Data";
import { HashData } from "@taigalabs/prfs-circuit-interface/bindings/HashData";

import {
  FormErrors,
  FormHandler,
  FormValues,
  HandleSkipCreateProof,
} from "@/components/circuit_input_items/formTypes";

export function useSimpleHashFormHandler({
  setFormHandler,
  setFormErrors,
  credential,
  proofAction,
}: UseSimpleHashFormHandlerArgs) {
  React.useEffect(() => {
    setFormHandler(() => async (formValues: FormValues<SimpleHashV1Inputs>) => {
      const val = formValues as SimpleHashV1Inputs | undefined;

      if (!val?.hashData) {
        setFormErrors(oldVal => ({
          ...oldVal,
          hashData: "Input is empty",
        }));
        return { isValid: false as const };
      } else {
        const { msgRaw, msgRawInt, msgHash } = val.hashData;

        if (!msgRaw || !msgRawInt || !msgHash) {
          setFormErrors(oldVal => ({
            ...oldVal,
            hashData: "Hashed outcome should be provided. Have you hashed the input?",
          }));
          return { isValid: false as const };
        }
      }

      const { pkHex, skHex } = await deriveProofKey(credential.secret_key, val.hashData.msgRaw);
      val.proofPubKey = pkHex;

      const proofActionSigMsg = toUtf8Bytes(proofAction);
      const wallet = new Wallet(skHex);
      const sig = await wallet.signMessage(proofActionSigMsg);

      return {
        isValid: true,
        proofAction,
        proofPubKey: pkHex,
        proofActionSig: sig,
        proofActionSigMsg: Array.from(proofActionSigMsg),
      };
    });
  }, [setFormHandler, setFormErrors, proofAction]);
}

export interface UseSimpleHashFormHandlerArgs {
  setFormHandler: React.Dispatch<React.SetStateAction<FormHandler | null>>;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors<SimpleHashV1Inputs>>>;
  credential: PrfsIdCredential;
  proofAction: string;
}
