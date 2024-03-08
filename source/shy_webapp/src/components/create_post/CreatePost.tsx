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

import styles from "./CreatePost.module.scss";
import TextEditor from "@/components/text_editor/TextEditor";
import { useI18N } from "@/i18n/hook";
import CreatePostEditorFooter from "./CreatePostEditorFooter";
import { envs } from "@/envs";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { MerkleSigPosRangeV1PublicInputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PublicInputs";
import { ShyTopicProofAction } from "@taigalabs/shy-entities/bindings/ShyTopicProofAction";
import { MerkleSigPosRangeV1PresetVals } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PresetVals";
import { SHY_APP_ID } from "@/app_id";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";

const PROOF = "Proof";

const CreatePost: React.FC<CreatePostProps> = ({ handleClickCancel, channel, topicId }) => {
  const i18n = useI18N();
  const [error, setError] = React.useState<string | null>(null);

  const handleClickReply = React.useCallback(
    async (html: string) => {
      setError(null);

      if (channel.proof_type_ids.length < 1) {
        setError("Proof type does not exist");
        return;
      }

      const proofTypeId = channel.proof_type_ids[0];
      const session_key = createSessionKey();
      const { sk, pkHex } = createRandomKeyPair();
      const json = JSON.stringify({ appId: SHY_APP_ID, topicId });

      const proofAction: ShyTopicProofAction = {
        type: "create_shy_topic",
        topic_id: topicId,
      };
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
            proofAction: JSON.stringify(proofAction),
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

        console.log(22, proofGenPayload);

        // const proveReceipt = proofGenPayload.receipt[PROOF] as ProveReceipt;
        // const publicInputs: MerkleSigPosRangeV1PublicInputs = JSONbigNative.parse(
        //   proveReceipt.proof.publicInputSer,
        // );

        // const shy_topic_proof_id = rand256Hex();
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
        //   author_sig: proveReceipt.proof.proofActionResult,
        // });

        if (error) {
          throw new Error(`Failed to create a topic, err: ${error}`);
        }

        // console.log("create shy topic resp", payload, error);
        // router.push(`${paths.c}/${channel.channel_id}/${pathParts.t}/${topicId}`);
      } catch (err) {
        console.error(err);
      }
      ws.close();
      popup.close();
    },
    [channel, topicId, setError],
  );

  const footer = React.useMemo(() => {
    return (
      <CreatePostEditorFooter
        handleClickCancel={handleClickCancel}
        handleClickReply={handleClickReply}
      />
    );
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <TextEditor footer={footer} />
      </div>
    </div>
  );
};

export default CreatePost;

export interface CreatePostProps {
  handleClickCancel: () => void;
  topicId: string;
  channel: ShyChannel;
}
