import React from "react";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { CreatePrfsProofRecordRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofRecordRequest";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
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
import { useRouter } from "next/navigation";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { CreateShyPostRequest } from "@taigalabs/shy-entities/bindings/CreateShyPostRequest";
import { ShyPostProofAction } from "@taigalabs/shy-entities/bindings/ShyPostProofAction";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import { MerkleSigPosRangeV1PresetVals } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PresetVals";
import { MerkleSigPosRangeV1PublicInputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PublicInputs";

import styles from "./CreatePostForm.module.scss";
import { paths } from "@/paths";
import TextEditor from "@/components/text_editor/TextEditor";
import { useI18N } from "@/i18n/hook";
import { envs } from "@/envs";
import EditorFooter from "./EditorFooter";
import { SHY_APP_ID } from "@/app_id";

const PROOF = "Proof";

const CreatePostForm: React.FC<CreatePostFormProps> = ({ channel }) => {
  const i18n = useI18N();
  const router = useRouter();
  const [title, setTitle] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const [postId, shortId] = React.useMemo(() => {
    const hex = rand256Hex();
    return [hex, hex.substring(0, 10)];
  }, []);
  const { mutateAsync: createShyPost } = useMutation({
    mutationFn: (req: CreateShyPostRequest) => {
      return shyApi2({ type: "create_shy_post", ...req });
    },
  });
  const { mutateAsync: createPrfsProofRecord } = useMutation({
    mutationFn: (req: CreatePrfsProofRecordRequest) => {
      return prfsApi3({ type: "create_prfs_proof_record", ...req });
    },
  });

  const handleChangeTitle = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(ev.target.value);
    },
    [setTitle],
  );

  const handleCreatePost = React.useCallback(
    async (html: string) => {
      setError(null);

      if (title.length < 1) {
        setError("Title needs to be present");
        return;
      }

      if (channel.proof_type_ids.length < 1) {
        setError("Proof type does not exist");
        return;
      }

      const proofTypeId = channel.proof_type_ids[0];
      const session_key = createSessionKey();
      const { sk, pkHex } = createRandomKeyPair();
      const json = JSON.stringify({ appId: SHY_APP_ID, postId });

      const proofAction: ShyPostProofAction = {
        type: "create_shy_post",
        post_id: postId,
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

        const proveReceipt = proofGenPayload.receipt[PROOF] as ProveReceipt;
        const publicInputs: MerkleSigPosRangeV1PublicInputs = JSONbigNative.parse(
          proveReceipt.proof.publicInputSer,
        );

        const shy_post_proof_id = rand256Hex();
        const { payload, error } = await createShyPost({
          title,
          post_id: postId,
          content: html,
          channel_id: channel.channel_id,
          shy_post_proof_id,
          proof_identity_input: publicInputs.proofIdentityInput,
          proof: Array.from(proveReceipt.proof.proofBytes),
          public_inputs: proveReceipt.proof.publicInputSer,
          public_key: publicInputs.proofPubKey,
          serial_no: publicInputs.circuitPubInput.serialNo,
          author_sig: proveReceipt.proof.proofActionResult,
        });

        console.log("create shy post resp", payload, error);
        // router.push(`${paths.c}/${channel.channel_id}`);
      } catch (err) {
        console.error(err);
      }
      ws.close();
      popup.close();
    },
    [channel, postId, title, setError, createShyPost, router],
  );

  const footer = React.useMemo(() => {
    return (
      <>
        {error && <div className={styles.error}>{error}</div>}
        <EditorFooter handleClickPost={handleCreatePost} />
      </>
    );
  }, [error, title]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <span>{i18n.create_a_post}</span>
        <span> ({shortId}...)</span>
      </div>
      <div className={styles.titleInput}>
        <input
          type="text"
          placeholder={i18n.what_is_this_discussion_about_in_one_sentence}
          value={title}
          onChange={handleChangeTitle}
        />
      </div>
      <div className={styles.editorWrapper}>
        <TextEditor footer={footer} />
      </div>
    </div>
  );
};

export default CreatePostForm;

export interface CreatePostFormProps {
  channel: ShyChannel;
}
