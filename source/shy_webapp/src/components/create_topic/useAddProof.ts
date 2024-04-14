import React from "react";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
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
import { useRouter } from "next/navigation";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { CreateShyTopicRequest } from "@taigalabs/shy-entities/bindings/CreateShyTopicRequest";
import { AssocProofTypeId } from "@taigalabs/shy-entities/bindings/AssocProofTypeId";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import { MerkleSigPosRangeV1PresetVals } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PresetVals";
import { MerkleSigPosRangeV1PublicInputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PublicInputs";
import { usePrfsIdSession } from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/use_prfs_id_session";
import { ShyTopicProofAction } from "@taigalabs/shy-entities/bindings/ShyTopicProofAction";
import PrfsIdSessionDialog from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/PrfsIdSessionDialog";
import { PrfsIdSession } from "@taigalabs/prfs-entities/bindings/PrfsIdSession";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { computeAddress } from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";
import { SHY_APP_ID } from "@/app_id";
import { useAppDispatch } from "@/state/hooks";
import { setGlobalMsg } from "@/state/globalMsgReducer";
import { Editor } from "@tiptap/react";
import { envs } from "@/envs";

const PROOF = "Proof";

export function useAddProof({
  // channel,
  channelId,
  proofTypeId,
  setError,
  topicId,
  editor,
  setHtml,
  handleSucceedAddProof,
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

    const session_key = createSessionKey();
    const { sk, pkHex } = createRandomKeyPair();
    const json = JSON.stringify({ appId: SHY_APP_ID, topicId });

    const proofAction: ShyTopicProofAction = {
      type: "create_shy_topic",
      topic_id: topicId,
      channel_id: channelId,
      content: html,
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
      };
      handleSucceedAddProof(proof);

      // const { error } = await createShyTopic({
      //   title,
      //   topic_id: topicId,
      //   content: html,
      //   channel_id: channel.channel_id,
      //   shy_proof_id,
      //   proof_identity_input: publicInputs.proofIdentityInput,
      //   proof: Array.from(proveReceipt.proof.proofBytes),
      //   public_inputs: proveReceipt.proof.publicInputSer,
      //   author_public_key: publicInputs.proofPubKey,
      //   serial_no: JSONbigNative.stringify(publicInputs.circuitPubInput.serialNo),
      //   author_sig: proveReceipt.proofActionSig,
      //   author_sig_msg: Array.from(proveReceipt.proofActionSigMsg),
      //   sub_channel_id: subChannelId,
      //   proof_type_id: channel.proof_type_ids[0],
      // });

      // if (error) {
      //   dispatch(
      //     setGlobalMsg({
      //       variant: "error",
      //       message: `Failed to create a topic, err: ${error}`,
      //     }),
      //   );
      //   return;
      // }

      // setStatus(Status.Standby);
      // router.push(`${paths.c}/${channel.channel_id}/${pathParts.t}/${topicId}`);
      // setIsNavigating(true);
    },
    [sk, dispatch, dispatch, channelId, proofTypeId],
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
  setHtml: React.Dispatch<React.SetStateAction<string | null>>;
  handleSucceedAddProof: (proof: ProofBlob) => void;
}

export interface ProofBlob {
  shy_proof_id: string;
  proof_identity_input: string;
  proof: number[];
  public_inputs: string;
  serial_no: string;
  author_public_key: string;
  author_sig: string;
  author_sig_msg: number[];
  proof_type_id: string;
}
