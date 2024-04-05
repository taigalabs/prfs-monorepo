import React from "react";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { toUtf8Bytes } from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { PrfsIdCredential, deriveProofKey } from "@taigalabs/prfs-id-sdk-web";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
import { MerkleSigPosRangeV1PresetVals } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PresetVals";
import { GetPrfsProofRecordRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofRecordRequest";
import { Wallet } from "@taigalabs/prfs-crypto-deps-js/ethers";

import {
  FormErrors,
  FormHandler,
  FormValues,
  HandleSkipCreateProof,
} from "@/components/circuit_input_items/formTypes";

export function useMerkleSigPosRangeFormHandler({
  setFormHandler,
  setFormErrors,
  credential,
  proofAction,
}: UseMerkleSigPosRangeFormHandlerArgs) {
  React.useEffect(() => {
    setFormHandler(() => async (formValues: FormValues<MerkleSigPosRangeV1Inputs>) => {
      const val = formValues as MerkleSigPosRangeV1Inputs | undefined;
      if (!val) {
        setFormErrors(oldVal => ({
          ...oldVal,
          merkleProof: "Form is empty, something is wrong",
        }));
        return { isValid: false as const };
      }

      if (!val?.merkleProof) {
        setFormErrors(oldVal => ({
          ...oldVal,
          merkleProof: "Merkle proof is empty",
        }));
        return { isValid: false as const };
      }

      const { root, siblings, pathIndices } = val.merkleProof;
      if (!root || !siblings || !pathIndices) {
        setFormErrors(oldVal => ({
          ...oldVal,
          merkleProof: "Merkle path is not provided. Have you put address?",
        }));
        return { isValid: false as const };
      }

      if (!val.nonceRaw || val.nonceRaw.length === 0) {
        setFormErrors(oldVal => ({
          ...oldVal,
          nonceRaw: "Nonce raw is empty",
        }));
        return { isValid: false as const };
      }

      const { pkHex, skHex } = await deriveProofKey(credential.secret_key, val.nonceRaw);
      val.proofPubKey = pkHex;

      const proofActionSigMsg = toUtf8Bytes(proofAction);
      const wallet = new Wallet(skHex);
      const sig = await wallet.signMessage(proofActionSigMsg);

      // const recoveredAddr = walletUtils.verifyMessage(proofActionSigMsg, sig);
      // const computedAddr = computeAddress(pkHex);
      // console.log(
      //   "proofAction: %o, sigMsg: %s, sig: %o, pkHex: %o, recoveredAddr: %o, computedAddr: %o",
      //   proofAction,
      //   proofActionSigMsg,
      //   sig,
      //   pkHex,
      //   recoveredAddr,
      //   computedAddr,
      // );

      return {
        isValid: true,
        proofAction,
        proofActionSig: sig,
        proofActionSigMsg: Array.from(proofActionSigMsg),
      };
    });
  }, [setFormHandler, setFormErrors, proofAction]);
}

export function useCachedProveReceiptCreator({
  presetVals,
  usePrfsRegistry,
  credential,
  handleSkipCreateProof,
  proofAction,
}: UseCachedProveReceiptCreatorArgs) {
  const { mutateAsync: getPrfsProofRecord } = useMutation({
    mutationFn: (req: GetPrfsProofRecordRequest) => {
      return prfsApi3({ type: "get_prfs_proof_record", ...req });
    },
  });

  React.useEffect(() => {
    async function fn() {
      if (presetVals?.nonceRaw && usePrfsRegistry) {
        const { pkHex, skHex } = await deriveProofKey(credential.secret_key, presetVals.nonceRaw);
        const { payload, error } = await getPrfsProofRecord({
          public_key: pkHex,
        });

        if (error) {
        }

        if (payload) {
          if (payload.proof_record) {
            const proofActionSigMsg = toUtf8Bytes(proofAction);
            const wallet = new Wallet(skHex);
            const sig = await wallet.signMessage(proofActionSigMsg);

            // console.log("proofAction: %o, str: %o", proofAction, proofActionSigMsg);
            // console.log("sig: %s, skHex: %o, sigMsg: %o", sig, skHex, proofActionSigMsg);
            // const addr = ethers.utils.verifyMessage(proofActionSigMsg, sig);
            // const addr2 = computeAddress(pkHex);
            // console.log("addr", addr, addr2);
            // console.log("pkHex", pkHex);

            handleSkipCreateProof({
              type: "cached_prove_receipt",
              proofAction,
              proofActionSigMsg: Array.from(proofActionSigMsg),
              proofActionSig: sig,
              proofPubKey: pkHex,
            });
          }
        }
      }
    }
    fn().then();
  }, [presetVals, proofAction, getPrfsProofRecord, usePrfsRegistry, handleSkipCreateProof]);
}

export interface UseMerkleSigPosRangeFormHandlerArgs {
  setFormHandler: React.Dispatch<React.SetStateAction<FormHandler | null>>;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors<MerkleSigPosRangeV1Inputs>>>;
  credential: PrfsIdCredential;
  proofAction: string;
}

export interface UseCachedProveReceiptCreatorArgs {
  presetVals?: MerkleSigPosRangeV1PresetVals;
  credential: PrfsIdCredential;
  proofAction: string;
  usePrfsRegistry?: boolean;
  handleSkipCreateProof: HandleSkipCreateProof;
}
