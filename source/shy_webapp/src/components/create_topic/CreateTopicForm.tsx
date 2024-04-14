import React from "react";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { MdInfoOutline } from "@react-icons/all-files/md/MdInfoOutline";
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

import styles from "./CreateTopicForm.module.scss";
import { pathParts, paths } from "@/paths";
import TextEditor from "@/components/text_editor/TextEditor";
import { envs } from "@/envs";
import { SHY_APP_ID } from "@/app_id";
import { useAppDispatch } from "@/state/hooks";
import { setGlobalMsg } from "@/state/globalMsgReducer";
import Button from "@/components/button/Button";
import { useTextEditor } from "@/components/text_editor/useTextEditor";
import { useAddProof } from "./useAddProof";

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
  // const {
  //   openPrfsIdSession,
  //   isPrfsDialogOpen,
  //   setIsPrfsDialogOpen,
  //   sessionKey,
  //   setSessionKey,
  //   sk,
  //   setSk,
  // } = usePrfsIdSession();
  const [html, setHtml] = React.useState<string | null>(null);
  const { topicId, shortTopicId } = React.useMemo(() => {
    const hex = rand256Hex();
    return { topicId: hex.substring(0, 22), shortTopicId: hex.substring(0, 8) };
  }, []);
  const requiredProofTypes = React.useMemo(() => {
    return channel.proof_type_ids.map(ty => {
      return (
        <span key={ty} className={styles.proofType}>
          {ty}
        </span>
      );
    });
  }, [channel.proof_type_ids]);
  const assocProofTypes = React.useMemo(() => {
    const ids = channel.assoc_proof_type_ids as AssocProofTypeId[];
    return ids.map(id => {
      return (
        <span key={id.proof_type_id} className={styles.proofType}>
          {id.proof_type_id}
        </span>
      );
    });
  }, [channel.assoc_proof_type_ids]);

  const [createInProgress, setCreateInProgress] = React.useState(Status.Standby);
  const { editor, extensions } = useTextEditor();

  const handleSucceedAddProof = React.useCallback(() => {
    console.log(123);
  }, []);

  const {
    handleAddProof,
    handleSucceedAddProofSession,
    sessionKey,
    isPrfsDialogOpen,
    setIsPrfsDialogOpen,
  } = useAddProof({
    channel,
    setError,
    topicId,
    editor,
    setHtml,
    handleSucceedAddProof,
  });

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

  // const handleCreateTopic = React.useCallback(async () => {
  //   setError(null);

  //   if (!editor) {
  //     return;
  //   }

  //   const html = editor.getHTML();

  //   if (title.length < 1) {
  //     setError("Title needs to be present");
  //     return;
  //   }

  //   if (title.length < 8) {
  //     setError("Title needs to be longer");
  //     return;
  //   }

  //   if (title.length > 100) {
  //     setError("Title needs to be shorter");
  //     return;
  //   }

  //   if (html.length < 20) {
  //     setError(`Content needs to be longer, current length: ${html.length}`);
  //     return;
  //   }

  //   if (channel.proof_type_ids.length < 1) {
  //     setError("Proof type does not exist");
  //     return;
  //   }

  //   const proofTypeId = channel.proof_type_ids[0];
  //   const session_key = createSessionKey();
  //   const { sk, pkHex } = createRandomKeyPair();
  //   const json = JSON.stringify({ appId: SHY_APP_ID, topicId });

  //   const proofAction: ShyTopicProofAction = {
  //     type: "create_shy_topic",
  //     topic_id: topicId,
  //     channel_id: channel.channel_id,
  //     content: html,
  //   };

  //   const proofActionStr = JSON.stringify(proofAction);
  //   const presetVals: MerkleSigPosRangeV1PresetVals = {
  //     nonceRaw: json,
  //   };
  //   const proofGenArgs: ProofGenArgs = {
  //     nonce: makeRandInt(1000000),
  //     app_id: SHY_APP_ID,
  //     queries: [
  //       {
  //         name: PROOF,
  //         proofTypeId,
  //         queryType: QueryType.CREATE_PROOF,
  //         presetVals,
  //         usePrfsRegistry: true,
  //         proofAction: proofActionStr,
  //       },
  //     ],
  //     public_key: pkHex,
  //     session_key,
  //   };

  //   const searchParams = makeProofGenSearchParams(proofGenArgs);
  //   const endpoint = `${envs.NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT}${API_PATH.proof_gen}${searchParams}`;

  //   const popup = openPopup(endpoint);
  //   if (!popup) {
  //     return;
  //   }

  //   const { payload: _ } = await openPrfsIdSession({
  //     key: proofGenArgs.session_key,
  //     value: null,
  //     ticket: "TICKET",
  //   });

  //   setIsPrfsDialogOpen(true);
  //   setSessionKey(proofGenArgs.session_key);
  //   setSk(sk);
  //   setHtml(html);
  // }, [
  //   channel,
  //   topicId,
  //   editor,
  //   title,
  //   setError,
  //   createShyTopic,
  //   router,
  //   setStatus,
  //   setIsNavigating,
  //   setSk,
  //   setSessionKey,
  //   setIsPrfsDialogOpen,
  //   setHtml,
  // ]);

  // const handleSucceedGetSession = React.useCallback(
  //   async (session: PrfsIdSession) => {
  //     if (!sk) {
  //       dispatch(
  //         setGlobalMsg({
  //           variant: "error",
  //           message: "Secret key is not set to decrypt Prfs ID session",
  //         }),
  //       );
  //       return;
  //     }

  //     if (!html) {
  //       dispatch(
  //         setGlobalMsg({
  //           variant: "error",
  //           message: "Post content does not exist",
  //         }),
  //       );
  //       return;
  //     }

  //     const buf = Buffer.from(session.value);
  //     let decrypted: string;
  //     try {
  //       decrypted = decrypt(sk.secret, buf).toString();
  //     } catch (err) {
  //       dispatch(
  //         setGlobalMsg({
  //           variant: "error",
  //           message: `Cannot decrypt payload, err: ${err}`,
  //         }),
  //       );
  //       return;
  //     }

  //     let payload: ProofGenSuccessPayload;
  //     try {
  //       payload = JSON.parse(decrypted) as ProofGenSuccessPayload;
  //     } catch (err) {
  //       dispatch(
  //         setGlobalMsg({
  //           variant: "error",
  //           message: `Cannot parse proof payload, err: ${err}`,
  //         }),
  //       );
  //       return;
  //     }

  //     const proveReceipt = payload.receipt[PROOF] as ProveReceipt;
  //     const publicInputs: MerkleSigPosRangeV1PublicInputs = JSONbigNative.parse(
  //       proveReceipt.proof.publicInputSer,
  //     );
  //     // console.log("proveReceipt: %o", proveReceipt);

  //     const recoveredAddr = walletUtils.verifyMessage(
  //       proveReceipt.proofActionSigMsg,
  //       proveReceipt.proofActionSig,
  //     );
  //     const addr = computeAddress(publicInputs.proofPubKey);
  //     if (recoveredAddr !== addr) {
  //       dispatch(
  //         setGlobalMsg({
  //           variant: "error",
  //           message: `Signature does not match, recovered: ${recoveredAddr}, addr: ${addr}`,
  //         }),
  //       );
  //       return;
  //     }

  //     const shy_proof_id = rand256Hex();
  //     const { error } = await createShyTopic({
  //       title,
  //       topic_id: topicId,
  //       content: html,
  //       channel_id: channel.channel_id,
  //       shy_proof_id,
  //       proof_identity_input: publicInputs.proofIdentityInput,
  //       proof: Array.from(proveReceipt.proof.proofBytes),
  //       public_inputs: proveReceipt.proof.publicInputSer,
  //       author_public_key: publicInputs.proofPubKey,
  //       serial_no: JSONbigNative.stringify(publicInputs.circuitPubInput.serialNo),
  //       author_sig: proveReceipt.proofActionSig,
  //       author_sig_msg: Array.from(proveReceipt.proofActionSigMsg),
  //       sub_channel_id: subChannelId,
  //       proof_type_id: channel.proof_type_ids[0],
  //     });

  //     if (error) {
  //       dispatch(
  //         setGlobalMsg({
  //           variant: "error",
  //           message: `Failed to create a topic, err: ${error}`,
  //         }),
  //       );
  //       return;
  //     }

  //     setStatus(Status.Standby);
  //     router.push(`${paths.c}/${channel.channel_id}/${pathParts.t}/${topicId}`);
  //     setIsNavigating(true);
  //   },
  //   [sk, dispatch, html, dispatch, channel],
  // );

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
          {editor && <TextEditor editor={editor} className={styles.editorWrapper} />}
        </div>
        <div className={styles.proofGuideRow}>
          <div className={styles.inner}>
            <MdInfoOutline className={styles.icon} />
            <span>
              Make sure you finish writing the contents before adding proofs. Otherwise, proofs will
              be broken.
            </span>
          </div>
        </div>
        <div className={styles.btnRow}>
          <p className={styles.proofTypeGuide}>
            <span className={styles.guide}>
              This channel <b>requires</b> you to add one or more proofs of the following types:
            </span>
            {requiredProofTypes}
          </p>
          <button onClick={handleAddProof} type="button">
            <HoverableText>{i18n.add_proof}</HoverableText>
          </button>
        </div>
        {channel.assoc_proof_type_ids.length > 0 && (
          <div className={styles.btnRow}>
            <p className={styles.proofTypeGuide}>
              <span className={styles.guide}>
                Additionally, this channel <b>allows</b> you to add one or more proofs of the
                following types:
              </span>
              {assocProofTypes}
            </p>
            <button onClick={() => {}} type="button">
              <HoverableText>{i18n.add_proof}</HoverableText>
            </button>
          </div>
        )}
        {/* <div className={styles.btnRow}> */}
        {/*   <Button variant="green_1" handleClick={handleCreateTopic}> */}
        {/*     {createInProgress === Status.InProgress ? <Spinner /> : i18n.post} */}
        {/*   </Button> */}
        {/* </div> */}
        {error && <div className={styles.error}>{error}</div>}
      </div>
      <PrfsIdSessionDialog
        sessionKey={sessionKey}
        isPrfsDialogOpen={isPrfsDialogOpen}
        setIsPrfsDialogOpen={setIsPrfsDialogOpen}
        actionLabel={i18n.create_proof.toLowerCase()}
        handleSucceedGetSession={handleSucceedAddProofSession}
      />
    </>
  );
};

export default CreateTopicForm;

export interface CreateTopicFormProps {
  channel: ShyChannel;
  subChannelId: string;
}
