import React from "react";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import {
  API_PATH,
  ProofGenArgs,
  ProofGenSuccessPayload,
  QueryType,
  createSessionKey,
  makeProofGenSearchParams,
  openPopup,
} from "@taigalabs/prfs-id-sdk-web";
import {
  JSONbigNative,
  createRandomKeyPair,
  decrypt,
  makeRandInt,
  rand256Hex,
} from "@taigalabs/prfs-crypto-js";
import { utils as walletUtils } from "@taigalabs/prfs-crypto-deps-js/ethers";
import { MerkleSigPosRangeV1PresetVals } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PresetVals";
import { MerkleSigPosRangeV1PublicInputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PublicInputs";
import { usePrfsIdSession } from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/use_prfs_id_session";
import { ShyTopicProofAction } from "@taigalabs/shy-entities/bindings/ShyTopicProofAction";
import { PrfsIdSession } from "@taigalabs/prfs-entities/bindings/PrfsIdSession";
import { computeAddress, toUtf8Bytes } from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";
import { keccak256 } from "@taigalabs/prfs-crypto-deps-js/viem";
import { Editor } from "@tiptap/react";
import { ProofBlob } from "@taigalabs/shy-entities/bindings/ProofBlob";

import { SHY_APP_ID } from "@/app_id";
import { useAppDispatch } from "@/state/hooks";
import { setGlobalMsg } from "@/state/globalMsgReducer";
import { envs } from "@/envs";

const PROOF = "Proof";

export function useAddProof({
  channelId,
  proofTypeId,
  setError,
  topicId,
  editor,
  title,
  setHtml,
  handleSucceedAddProof,
  proofIdx,
  isRequired,
}: UseAddProofArgs) {
  const dispatch = useAppDispatch();

  const {
    openPrfsIdSession,
    isPrfsDialogOpen,
    setIsPrfsDialogOpen,
    sessionKey,
    setSessionKey,
    sk,
    setSk,
  } = usePrfsIdSession();

  const handleAddProof = React.useCallback(async () => {
    if (!editor) {
      return;
    }

    if (!proofTypeId) {
      return;
    }

    const html = editor.getHTML();

    const titleHash = keccak256(toUtf8Bytes(title));
    const htmlHash = keccak256(toUtf8Bytes(html));

    const session_key = createSessionKey();
    const { sk, pkHex } = createRandomKeyPair();
    const json = JSON.stringify({ appId: SHY_APP_ID, topicId });

    const proofAction: ShyTopicProofAction = {
      type: "create_shy_topic",
      topic_id: topicId,
      channel_id: channelId,
      title_hash: titleHash,
      content_hash: htmlHash,
    };

    const proofActionStr = JSON.stringify(proofAction);
    const presetVals: MerkleSigPosRangeV1PresetVals = {
      nonceRaw: json,
    };
    const proofGenArgs: ProofGenArgs = {
      nonce: makeRandInt(1000000),
      app_id: SHY_APP_ID,
      queries: [
        {
          name: PROOF,
          proofTypeId,
          queryType: QueryType.CREATE_PROOF,
          presetVals,
          usePrfsRegistry: true,
          proofAction: proofActionStr,
        },
      ],
      public_key: pkHex,
      session_key,
    };

    const searchParams = makeProofGenSearchParams(proofGenArgs);
    const endpoint = `${envs.NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT}${API_PATH.proof_gen}${searchParams}`;

    const popup = openPopup(endpoint);
    if (!popup) {
      return;
    }

    const { payload: _ } = await openPrfsIdSession({
      key: proofGenArgs.session_key,
      value: null,
      ticket: "TICKET",
    });

    setIsPrfsDialogOpen(true);
    setSessionKey(proofGenArgs.session_key);
    setSk(sk);
    setHtml(html);
  }, [
    proofTypeId,
    title,
    channelId,
    topicId,
    editor,
    setError,
    setSk,
    setSessionKey,
    setIsPrfsDialogOpen,
    setHtml,
  ]);

  const handleSucceedAddProofSession = React.useCallback(
    async (session: PrfsIdSession) => {
      if (!proofTypeId) {
        return;
      }

      if (!sk) {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: "Secret key is not set to decrypt Prfs ID session",
          }),
        );
        return;
      }

      const buf = Buffer.from(session.value);
      let decrypted: string;
      try {
        decrypted = decrypt(sk.secret, buf).toString();
      } catch (err) {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: `Cannot decrypt payload, err: ${err}`,
          }),
        );
        return;
      }

      let payload: ProofGenSuccessPayload;
      try {
        payload = JSON.parse(decrypted) as ProofGenSuccessPayload;
      } catch (err) {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: `Cannot parse proof payload, err: ${err}`,
          }),
        );
        return;
      }

      const proveReceipt = payload.receipt[PROOF] as ProveReceipt;
      const publicInputs: MerkleSigPosRangeV1PublicInputs = JSONbigNative.parse(
        proveReceipt.proof.publicInputSer,
      );
      // console.log("proveReceipt: %o", proveReceipt);

      const recoveredAddr = walletUtils.verifyMessage(
        proveReceipt.proofActionSigMsg,
        proveReceipt.proofActionSig,
      );
      const addr = computeAddress(publicInputs.proofPubKey);
      if (recoveredAddr !== addr) {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: `Signature does not match, recovered: ${recoveredAddr}, addr: ${addr}`,
          }),
        );
        return;
      }

      const shy_proof_id = rand256Hex();
      const proof = {
        shy_proof_id,
        proof_identity_input: publicInputs.proofIdentityInput,
        proof: Array.from(proveReceipt.proof.proofBytes),
        public_inputs: proveReceipt.proof.publicInputSer,
        serial_no: JSONbigNative.stringify(publicInputs.circuitPubInput.serialNo),
        author_public_key: publicInputs.proofPubKey,
        author_sig: proveReceipt.proofActionSig,
        author_sig_msg: Array.from(proveReceipt.proofActionSigMsg),
        proof_type_id: proofTypeId,
        proof_idx: proofIdx,
        is_required: isRequired,
      };
      handleSucceedAddProof(proof);
    },
    [sk, dispatch, dispatch, channelId, proofTypeId, proofIdx],
  );

  return {
    handleAddProof,
    handleSucceedAddProof,
    handleSucceedAddProofSession,
    isPrfsDialogOpen,
    setIsPrfsDialogOpen,
    sessionKey,
  };
}

export interface UseAddProofArgs {
  channelId: string;
  proofTypeId: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  topicId: string;
  editor: Editor | null;
  title: string;
  setHtml: React.Dispatch<React.SetStateAction<string | null>>;
  handleSucceedAddProof: (proof: ProofBlob) => void;
  proofIdx: number;
  isRequired: boolean;
}
