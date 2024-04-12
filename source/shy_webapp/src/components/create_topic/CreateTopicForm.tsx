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
  PrivateKey,
  createRandomKeyPair,
  decrypt,
  makeRandInt,
  rand256Hex,
} from "@taigalabs/prfs-crypto-js";
import { utils as walletUtils } from "@taigalabs/prfs-crypto-deps-js/ethers";
import { useRouter } from "next/navigation";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { CreateShyTopicRequest } from "@taigalabs/shy-entities/bindings/CreateShyTopicRequest";
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
import TextEditor2 from "@taigalabs/prfs-lexical-react";

import styles from "./CreateTopicForm.module.scss";
import { pathParts, paths } from "@/paths";
import TextEditor from "@/components/text_editor/TextEditor";
import { envs } from "@/envs";
import { SHY_APP_ID } from "@/app_id";
import CreateTopicFooter from "./CreateTopicFooter";
import { useAppDispatch } from "@/state/hooks";
import { setGlobalMsg } from "@/state/globalMsgReducer";

const PROOF = "Proof";

enum Status {
  Standby,
  InProgress,
}

const CreateTopicForm: React.FC<CreateTopicFormProps> = ({ channel, subChannelId }) => {
  const i18n = usePrfsI18N();
  const router = useRouter();
  const [title, setTitle] = React.useState<string>("");
  const [status, setStatus] = React.useState(Status.Standby);
  const dispatch = useAppDispatch();
  const [isNavigating, setIsNavigating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const {
    openPrfsIdSession,
    isPrfsDialogOpen,
    setIsPrfsDialogOpen,
    sessionKey,
    setSessionKey,
    sk,
    setSk,
  } = usePrfsIdSession();
  const [html, setHtml] = React.useState<string | null>(null);
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

      if (title.length < 8) {
        setError("Title needs to be longer");
        return;
      }

      if (title.length > 100) {
        setError("Title needs to be shorter");
        return;
      }

      if (html.length < 20) {
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
    },
    [
      channel,
      topicId,
      title,
      setError,
      createShyTopic,
      router,
      setStatus,
      setIsNavigating,
      setSk,
      setSessionKey,
      setIsPrfsDialogOpen,
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
      const { error } = await createShyTopic({
        title,
        topic_id: topicId,
        content: html,
        channel_id: channel.channel_id,
        shy_proof_id,
        proof_identity_input: publicInputs.proofIdentityInput,
        proof: Array.from(proveReceipt.proof.proofBytes),
        public_inputs: proveReceipt.proof.publicInputSer,
        author_public_key: publicInputs.proofPubKey,
        serial_no: JSONbigNative.stringify(publicInputs.circuitPubInput.serialNo),
        author_sig: proveReceipt.proofActionSig,
        author_sig_msg: Array.from(proveReceipt.proofActionSigMsg),
        sub_channel_id: subChannelId,
        proof_type_id: channel.proof_type_ids[0],
      });

      if (error) {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: `Failed to create a topic, err: ${error}`,
          }),
        );
        return;
      }

      setStatus(Status.Standby);
      router.push(`${paths.c}/${channel.channel_id}/${pathParts.t}/${topicId}`);
      setIsNavigating(true);
    },
    [sk, dispatch, html, dispatch, channel],
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
    <>
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
          {/* <TextEditor */}
          {/*   footer={footer} */}
          {/*   className={styles.editorWrapper} */}
          {/*   editorClassName={styles.editor} */}
          {/* /> */}
          <TextEditor2 />
        </div>
        {error && <div className={styles.error}>{error}</div>}
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

export default CreateTopicForm;

export interface CreateTopicFormProps {
  channel: ShyChannel;
  subChannelId: string;
}
