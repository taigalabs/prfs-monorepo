import React from "react";
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
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { GenericProveReceipt, ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { ShyPostProofAction } from "@taigalabs/shy-entities/bindings/ShyPostProofAction";
import { MerkleSigPosRangeV1PresetVals } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PresetVals";
import { useRouter } from "next/navigation";
import { shyApi2 } from "@taigalabs/shy-api-js";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { GetShyProofRequest } from "@taigalabs/shy-entities/bindings/GetShyProofRequest";
import { CreateShyPostRequest } from "@taigalabs/shy-entities/bindings/CreateShyPostRequest";
import { CreateShyPostWithProofRequest } from "@taigalabs/shy-entities/bindings/CreateShyPostWithProofRequest";
import { MerkleSigPosRangeV1PublicInputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PublicInputs";
import { usePrfsIdSession } from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/use_prfs_id_session";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import PrfsIdSessionDialog from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/PrfsIdSessionDialog";
import { PrfsIdSession } from "@taigalabs/prfs-entities/bindings/PrfsIdSession";

import styles from "./CreatePost.module.scss";
import TextEditor from "@/components/text_editor/TextEditor";
import CreatePostEditorFooter from "./CreatePostEditorFooter";
import { envs } from "@/envs";
import { SHY_APP_ID } from "@/app_id";
import ErrorDialog from "./ErrorDialog";
import { useAppDispatch } from "@/state/hooks";
import { setGlobalMsg } from "@/state/globalMsgReducer";
import { useGetShyProof } from "@/hooks/proof";

const PROOF = "Proof";

const CreatePost: React.FC<CreatePostProps> = ({
  handleClickCancel,
  channel,
  subChannelId,
  topicId,
  handleSucceedPost,
}) => {
  const i18n = usePrfsI18N();
  const router = useRouter();
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
  const [error, setError] = React.useState<string | null>(null);
  const [postId, setPostId] = React.useState<string | null>(null);
  const [html, setHtml] = React.useState<string | null>(null);

  const { mutateAsync: getShyProof } = useGetShyProof();
  // const { mutateAsync: getShyProof } = useMutation({
  //   mutationFn: (req: GetShyProofRequest) => {
  //     return shyApi2({ type: "get_shy_proof", ...req });
  //   },
  // });

  const { mutateAsync: createShyPost } = useMutation({
    mutationFn: (req: CreateShyPostRequest) => {
      return shyApi2({ type: "create_shy_post", ...req });
    },
  });

  const { mutateAsync: createShyPostWithProof } = useMutation({
    mutationFn: (req: CreateShyPostWithProofRequest) => {
      return shyApi2({ type: "create_shy_post_with_proof", ...req });
    },
  });

  const handleClickReply = React.useCallback(
    async (html: string) => {
      setError(null);

      if (channel.proof_type_ids.length < 1) {
        setError("Proof type does not exist");
        return;
      }

      if (html.length < 10) {
        setError("Content needs to be longer");
        return;
      }

      const proofTypeId = channel.proof_type_ids[0];
      const session_key = createSessionKey();
      const { sk, pkHex } = createRandomKeyPair();
      const json = JSON.stringify({ appId: SHY_APP_ID, topicId });
      const postId = rand256Hex();

      const proofAction: ShyPostProofAction = {
        type: "create_shy_post",
        topic_id: topicId,
        post_id: postId,
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
        console.error("Popup couldn't be open");
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
      setPostId(postId);
      setHtml(html);
    },
    [
      channel,
      topicId,
      setError,
      router,
      handleSucceedPost,
      dispatch,
      getShyProof,
      createShyPostWithProof,
      createShyPost,
      subChannelId,
      setSk,
      setSessionKey,
      setIsPrfsDialogOpen,
      openPrfsIdSession,
      setPostId,
      setHtml,
    ],
  );

  const handleSucceedGetSession = React.useCallback(
    async (session: PrfsIdSession) => {
      if (!sk) {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: "Secret key is not set to decrypt Prfs ID session",
          }),
        );
        return;
      }

      if (!html) {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: "Post content does not exist",
          }),
        );
        return;
      }

      if (!postId) {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: "Post Id does not exist",
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

      const receipt = payload.receipt[PROOF] as GenericProveReceipt;
      if (receipt.type === "cached_prove_receipt") {
        receipt.proofActionSigMsg;

        const { payload: getShyTopicProofPayload } = await getShyProof({
          public_key: receipt.proofPubKey,
        });
        if (getShyTopicProofPayload?.shy_proof) {
          const topicProof = getShyTopicProofPayload.shy_proof;

          const { payload: _createShyPostPayload } = await createShyPost({
            topic_id: topicId,
            channel_id: channel.channel_id,
            shy_proof_id: topicProof.shy_proof_id,
            author_public_key: topicProof.public_key,
            post_id: postId,
            content: html,
            author_sig: receipt.proofActionSig,
            author_sig_msg: Array.from(receipt.proofActionSigMsg),
          });
          handleSucceedPost();
        }
      } else if (receipt.type === "prove_receipt") {
        const shy_proof_id = rand256Hex();
        const receipt_ = receipt as ProveReceipt;
        console.log("receipt", receipt_);

        const publicInputs: MerkleSigPosRangeV1PublicInputs = JSONbigNative.parse(
          receipt_.proof.publicInputSer,
        );

        const { error } = await createShyPostWithProof({
          topic_id: topicId,
          channel_id: channel.channel_id,
          shy_proof_id,
          author_public_key: receipt_.proof.proofPubKey,
          post_id: postId,
          content: html,
          author_sig: receipt_.proofActionSig,
          author_sig_msg: Array.from(receipt_.proofActionSigMsg),
          proof_identity_input: publicInputs.proofIdentityInput,
          proof: Array.from(receipt.proof.proofBytes),
          public_inputs: receipt_.proof.publicInputSer,
          serial_no: publicInputs.circuitPubInput.serialNo.toString(),
          sub_channel_id: subChannelId,
          proof_type_id: channel.proof_type_ids[0],
        });

        if (error) {
        }

        handleSucceedPost();
      } else {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: `Unknown receipt type, receipt: ${(receipt as any).type}`,
          }),
        );
        return;
      }
    },
    [sk, dispatch, postId, html],
  );

  const footer = React.useMemo(() => {
    return (
      <CreatePostEditorFooter
        handleClickCancel={handleClickCancel}
        handleClickReply={handleClickReply}
      />
    );
  }, []);

  const handleClickClose = React.useCallback(() => {
    setError(null);
  }, [setError]);

  return (
    <>
      <div className={styles.wrapper}>
        {error && <ErrorDialog handleClickClose={handleClickClose} error={error} />}
        <div className={styles.inner}>
          <TextEditor footer={footer} />
        </div>
      </div>
      <PrfsIdSessionDialog
        sessionKey={sessionKey}
        isPrfsDialogOpen={isPrfsDialogOpen}
        setIsPrfsDialogOpen={setIsPrfsDialogOpen}
        actionLabel={i18n.create_proof.toLowerCase()}
        handleSucceedGetSession={handleSucceedGetSession}
      />
    </>
  );
};

export default CreatePost;

export interface CreatePostProps {
  handleClickCancel: () => void;
  handleSucceedPost: () => void;
  topicId: string;
  subChannelId: string;
  channel: ShyChannel;
}
