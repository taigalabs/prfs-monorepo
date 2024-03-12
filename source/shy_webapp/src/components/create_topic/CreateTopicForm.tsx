import React from "react";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
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
import { CreateShyTopicRequest } from "@taigalabs/shy-entities/bindings/CreateShyTopicRequest";
import { ShyTopicProofAction } from "@taigalabs/shy-entities/bindings/ShyTopicProofAction";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import { MerkleSigPosRangeV1PresetVals } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PresetVals";
import { MerkleSigPosRangeV1PublicInputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PublicInputs";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";

import styles from "./CreateTopicForm.module.scss";
import { pathParts, paths } from "@/paths";
import TextEditor from "@/components/text_editor/TextEditor";
import { envs } from "@/envs";
import { SHY_APP_ID } from "@/app_id";
import CreateTopicFooter from "./CreateTopicFooter";

const PROOF = "Proof";

enum Status {
  Standby,
  InProgress,
}

const CreateTopicForm: React.FC<CreateTopicFormProps> = ({ channel }) => {
  const i18n = usePrfsI18N();
  const router = useRouter();
  const [title, setTitle] = React.useState<string>("");
  const [status, setStatus] = React.useState(Status.Standby);
  const [isNavigating, setIsNavigating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { topicId, shortTopicId } = React.useMemo(() => {
    const hex = rand256Hex();
    return { topicId: hex.substring(0, 22), shortTopicId: hex.substring(0, 8) };
  }, []);
  const { mutateAsync: createShyTopic } = useMutation({
    mutationFn: (req: CreateShyTopicRequest) => {
      return shyApi2({ type: "create_shy_topic", ...req });
    },
  });

  const handleChangeTitle = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(ev.target.value);
    },
    [setTitle],
  );

  const handleCreateTopic = React.useCallback(
    async (html: string) => {
      setError(null);

      if (title.length < 1) {
        setError("Title needs to be present");
        return;
      }

      if (title.length < 10) {
        setError("Title needs to be longer");
        return;
      }

      if (title.length > 80) {
        setError("Title needs to be shorter");
        return;
      }

      if (html.length < 40) {
        setError("Content needs to be longer");
        return;
      }

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
        channel_id: channel.channel_id,
        content: html,
      };

      const proofActionStr = JSON.stringify(proofAction);
      console.log(11, proofAction, JSON.stringify(proofAction));

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

      setStatus(Status.InProgress);
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

        const shy_topic_proof_id = rand256Hex();
        const { payload, error } = await createShyTopic({
          title,
          topic_id: topicId,
          content: html,
          channel_id: channel.channel_id,
          shy_topic_proof_id,
          proof_identity_input: publicInputs.proofIdentityInput,
          proof: Array.from(proveReceipt.proof.proofBytes),
          public_inputs: proveReceipt.proof.publicInputSer,
          author_public_key: publicInputs.proofPubKey,
          serial_no: JSONbigNative.stringify(publicInputs.circuitPubInput.serialNo),
          author_sig: proveReceipt.proofActionSig,
          author_sig_msg: Array.from(proveReceipt.proofActionSigMsg),
          author_sig_msg2: proofActionStr,
        });

        if (error) {
          throw new Error(`Failed to create a topic, err: ${error}`);
        }

        console.log("create shy topic resp", payload, error);

        setStatus(Status.Standby);
        router.push(`${paths.c}/${channel.channel_id}/${pathParts.t}/${topicId}`);
        setIsNavigating(true);
      } catch (err) {
        console.error(err);
      }

      setStatus(Status.Standby);
      ws.close();
      popup.close();
    },
    [channel, topicId, title, setError, createShyTopic, router, setStatus, setIsNavigating],
  );

  const footer = React.useMemo(() => {
    return (
      <CreateTopicFooter
        handleClickTopic={handleCreateTopic}
        inProgress={status === Status.InProgress}
      />
    );
  }, [error, title, status]);

  return isNavigating ? (
    <div className={styles.navigating}>
      <Spinner variant="gray_1" />
    </div>
  ) : (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <span>{i18n.create_a_topic}</span>
        <span> ({shortTopicId})</span>
      </div>
      <div className={styles.titleInputWrapper}>
        <input
          className={styles.titleInput}
          type="text"
          placeholder={i18n.what_is_this_discussion_about_in_one_sentence}
          value={title}
          onChange={handleChangeTitle}
        />
      </div>
      <div className={styles.editorRow}>
        <TextEditor
          footer={footer}
          className={styles.editorWrapper}
          editorClassName={styles.editor}
        />
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default CreateTopicForm;

export interface CreateTopicFormProps {
  channel: ShyChannel;
}
