import React from "react";
import {
  API_PATH,
  ProofGenArgs,
  ProofGenSuccessPayload,
  QueryType,
  createSession,
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
import { setGlobalError } from "@taigalabs/prfs-react-lib/src/global_error_reducer";
import { GetShyTopicProofRequest } from "@taigalabs/shy-entities/bindings/GetShyTopicProofRequest";
import { CreateShyPostRequest } from "@taigalabs/shy-entities/bindings/CreateShyPostRequest";
import { CreateShyPostWithProofRequest } from "@taigalabs/shy-entities/bindings/CreateShyPostWithProofRequest";
import { MerkleSigPosRangeV1PublicInputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PublicInputs";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";

import styles from "./CreatePost.module.scss";
import TextEditor from "@/components/text_editor/TextEditor";
import CreatePostEditorFooter from "./CreatePostEditorFooter";
import { envs } from "@/envs";
import { SHY_APP_ID } from "@/app_id";
import ErrorDialog from "./ErrorDialog";
import { useAppDispatch } from "@/state/hooks";

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
  const [error, setError] = React.useState<string | null>(null);
  const { mutateAsync: getShyTopicProof } = useMutation({
    mutationFn: (req: GetShyTopicProofRequest) => {
      return shyApi2({ type: "get_shy_topic_proof", ...req });
    },
  });
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

      let sessionStream;
      try {
        sessionStream = await createSession({
          key: proofGenArgs.session_key,
          value: null,
          ticket: "TICKET",
        });
      } catch (err) {
        console.error(err);
        return;
      }

      if (!sessionStream) {
        console.error("Couldn't open a session");
        return;
      }

      const popup = openPopup(endpoint);
      if (!popup) {
        console.error("Popup couldn't be open");
        return;
      }

      const { ws, send, receive } = sessionStream;

      const session = await receive();
      if (!session) {
        console.error("Coultn' retreieve session");
        return;
      }

      try {
        if (session.error) {
          console.error(session.error);
          return;
        }

        if (!session.payload) {
          console.error("Session doesn't have a payload");
          return;
        }

        if (session.payload.type !== "put_prfs_id_session_value_result") {
          console.error("Wrong session payload type at this point, msg: %s", session.payload);
          return;
        }

        const buf = Buffer.from(session.payload.value);
        let decrypted: string;
        try {
          decrypted = decrypt(sk.secret, buf).toString();
        } catch (err) {
          console.error("cannot decrypt payload", err);
          return;
        }

        let proofGenPayload: ProofGenSuccessPayload;
        try {
          proofGenPayload = JSON.parse(decrypted) as ProofGenSuccessPayload;
        } catch (err) {
          console.error("cannot parse payload, err: %s, obj: %s", err, decrypted);
          return;
        }

        const receipt = proofGenPayload.receipt[PROOF] as GenericProveReceipt;

        if (receipt.type === "cached_prove_receipt") {
          const { payload: getShyTopicProofPayload } = await getShyTopicProof({
            public_key: receipt.proofPubKey,
          });
          if (getShyTopicProofPayload?.shy_topic_proof) {
            const topicProof = getShyTopicProofPayload.shy_topic_proof;

            const { payload: _createShyPostPayload } = await createShyPost({
              topic_id: topicId,
              channel_id: channel.channel_id,
              shy_topic_proof_id: topicProof.shy_topic_proof_id,
              author_public_key: topicProof.public_key,
              post_id: postId,
              content: html,
              author_sig: receipt.proofActionSig,
              author_sig_msg: Array.from(receipt.proofActionSigMsg),
            });
            handleSucceedPost();
          }
        } else if (receipt.type === "prove_receipt") {
          const shy_topic_proof_id = rand256Hex();
          const receipt_ = receipt as ProveReceipt;
          console.log(11, receipt_);

          const publicInputs: MerkleSigPosRangeV1PublicInputs = JSONbigNative.parse(
            receipt_.proof.publicInputSer,
          );

          const { payload, error } = await createShyPostWithProof({
            topic_id: topicId,
            channel_id: channel.channel_id,
            shy_topic_proof_id,
            author_public_key: receipt_.proof.proofKey,
            post_id: postId,
            content: html,
            author_sig: receipt_.proofActionSig,
            author_sig_msg: Array.from(receipt_.proofActionSigMsg),
            proof_identity_input: publicInputs.proofIdentityInput,
            proof: Array.from(receipt.proof.proofBytes),
            public_inputs: receipt_.proof.publicInputSer,
            serial_no: publicInputs.circuitPubInput.serialNo.toString(),
            sub_channel_id: subChannelId,
          });

          console.log(22, payload);

          // const { payload, error } = await createShyTopic({
          //   title,
          //   topic_id: topicId,
          //   content: html,
          //   channel_id: channel.channel_id,
          //   shy_topic_proof_id,
          //   proof_identity_input: publicInputs.proofIdentityInput,
          //   proof: Array.from(proveReceipt.proof.proofBytes),
          //   public_inputs: proveReceipt.proof.publicInputSer,
          //   author_public_key: publicInputs.proofPubKey,
          //   serial_no: JSONbigNative.stringify(publicInputs.circuitPubInput.serialNo),
          //   author_sig: proveReceipt.proofActionSig,
          //   author_sig_msg: Array.from(proveReceipt.proofActionSigMsg),
          //   sub_channel_id: subChannelId,
          // });
          // const { payload: getShyTopicProofPayload } = await getShyTopicProof({
          //   public_key: receipt.proofPubKey,
          // });
          // const topicProof = getShyTopicProofPayload.shy_topic_proof;
          // const { payload: createShyPostPayload } = await createShyPost({
          //   topic_id: topicId,
          //   channel_id: channel.channel_id,
          //   shy_topic_proof_id: topicProof.shy_topic_proof_id,
          //   author_public_key: topicProof.public_key,
          //   post_id: postId,
          //   content: html,
          //   author_sig: receipt.proofActionSig,
          //   author_sig_msg: Array.from(receipt.proofActionSigMsg),
          // });
          //
          // if (error) {
          //   throw new Error(`Failed to create a topic, err: ${error}`);
          // }
        } else {
          dispatch(
            setGlobalError({
              message: `Unknown receipt type, receipt: ${(receipt as any).type}`,
            }),
          );
          return;
        }

        if (error) {
          throw new Error(`Failed to create a topic, err: ${error}`);
        }
      } catch (err) {
        console.error(err);
      }
      ws.close();
      popup.close();
    },
    [
      channel,
      topicId,
      setError,
      router,
      handleSucceedPost,
      dispatch,
      getShyTopicProof,
      createShyPostWithProof,
      createShyPost,
      subChannelId,
    ],
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
    <div className={styles.wrapper}>
      {error && <ErrorDialog handleClickClose={handleClickClose} error={error} />}
      <div className={styles.inner}>
        <TextEditor footer={footer} />
      </div>
    </div>
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
