import React from "react";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import ConnectWallet from "@taigalabs/prfs-react-lib/src/connect_wallet/ConnectWallet";
import { makePathIndices, makeSiblingPath, poseidon_2_bigint_le } from "@taigalabs/prfs-crypto-js";
import {
  computeAddress,
  hexlify,
  toUtf8Bytes,
} from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { GetPrfsTreeLeafIndicesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeLeafIndicesRequest";
import { GetPrfsSetBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetBySetIdRequest";
import { GetPrfsTreeNodesByPosRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeNodesByPosRequest";
import { PrfsIdCredential, deriveProofKey, makeWalletAtstCm } from "@taigalabs/prfs-id-sdk-web";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
import { SpartanMerkleProof } from "@taigalabs/prfs-circuit-interface/bindings/SpartanMerkleProof";
import { GetPrfsSetElementRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetElementRequest";
import { PrfsSetElementData } from "@taigalabs/prfs-entities/bindings/PrfsSetElementData";
import { bytesToNumberLE } from "@taigalabs/prfs-crypto-js";
import { MerkleSigPosRangeV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Data";
import { GetLatestPrfsTreeBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetLatestPrfsTreeBySetIdRequest";
import { MerkleSigPosRangeV1PresetVals } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PresetVals";
import { PrfsTree } from "@taigalabs/prfs-entities/bindings/PrfsTree";
import { GetPrfsProofRecordRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofRecordRequest";
import { Wallet, utils as walletUtils } from "@taigalabs/prfs-crypto-deps-js/ethers";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import Input from "@taigalabs/prfs-react-lib/src/input/Input";

import { FormErrors, FormHandler, FormValues } from "@/components/circuit_input_items/formTypes";

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

interface UseMerkleSigPosRangeFormHandlerArgs {
  setFormHandler: React.Dispatch<React.SetStateAction<FormHandler | null>>;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors<MerkleSigPosRangeV1Inputs>>>;
  credential: PrfsIdCredential;
  proofAction: string;
}
