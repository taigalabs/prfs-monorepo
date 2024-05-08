import React from "react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { MdInfoOutline } from "@react-icons/all-files/md/MdInfoOutline";
import { rand256Hex } from "@taigalabs/prfs-crypto-js";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { AssocProofTypeId } from "@taigalabs/shy-entities/bindings/AssocProofTypeId";
import PrfsIdSessionDialog from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/PrfsIdSessionDialog";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import { ProofBlob } from "@taigalabs/shy-entities/bindings/ProofBlob";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";

import styles from "./CreateTopicForm.module.scss";
import TextEditor from "@/components/text_editor/TextEditor";
import Button from "@/components/button/Button";
import { useTextEditor } from "@/components/text_editor/useTextEditor";
import { useAddProof } from "./useAddProof";
import { Status, useCreateTopic } from "./useCreateTopic";

const CreateTopicForm: React.FC<CreateTopicFormProps> = ({ channel, subChannelId }) => {
  const i18n = usePrfsI18N();
  const [title, setTitle] = React.useState<string>("");
  const [status, setStatus] = React.useState(Status.Standby);
  const [isNavigating, setIsNavigating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  // const [firstProof, setFirstProof] = React.useState<ProofBlob | null>(null);
  const [proofs, setProofs] = React.useState<ProofBlob[]>([]);
  const { editor } = useTextEditor();
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

  const requiredProofIdsAbbrev = React.useMemo(() => {
    return proofs
      .filter(p => p.is_required)
      .map(p => {
        if (p.shy_proof_id.length > 15) {
          return abbrev7and5(proofs[0].shy_proof_id);
        } else {
          return p.shy_proof_id;
        }
      });
  }, [proofs]);

  const otherProofIdsAbbrev = React.useMemo(() => {
    return proofs
      .filter(p => !p.is_required)
      .map(p => {
        if (p.shy_proof_id.length > 15) {
          return abbrev7and5(proofs[0].shy_proof_id);
        } else {
          return p.shy_proof_id;
        }
      });
  }, [proofs]);

  const handleSucceedAddProof = React.useCallback(
    (proof: ProofBlob) => {
      setProofs(p => [...p, proof]);
    },
    [setProofs],
  );

  // const handleSucceedAddOtherProofs = React.useCallback(
  //   (proof: ProofBlob) => {
  //     setOtherProofs(oldVal => [...oldVal, proof]);
  //   },
  //   [setOtherProofs],
  // );

  const {
    handleAddProof,
    handleSucceedAddProofSession,
    sessionKey,
    isPrfsDialogOpen,
    setIsPrfsDialogOpen,
  } = useAddProof({
    channelId: channel.channel_id,
    proofTypeId: channel.proof_type_ids[0],
    setError,
    topicId,
    editor,
    setHtml,
    title,
    handleSucceedAddProof: handleSucceedAddProof,
    proofIdx: 0,
    isRequired: true,
  });

  const {
    handleAddProof: handleAddOtherProof,
    handleSucceedAddProofSession: handleSucceedAddOtherProofSession,
    sessionKey: sessionKey2,
    isPrfsDialogOpen: isPrfsDialogOpen2,
    setIsPrfsDialogOpen: setIsPrfsDialogOpen2,
  } = useAddProof({
    channelId: channel.channel_id,
    proofTypeId:
      channel.assoc_proof_type_ids.length > 0
        ? channel.assoc_proof_type_ids[0].proof_type_id
        : null,
    setError,
    topicId,
    title,
    editor,
    setHtml,
    handleSucceedAddProof: handleSucceedAddProof,
    proofIdx: proofs.length,
    isRequired: false,
  });

  const handleChangeTitle = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(ev.target.value);
    },
    [setTitle],
  );

  const { handleCreateTopic } = useCreateTopic({
    setError,
    html,
    title,
    proofs,
    // firstProof,
    // otherProofs,
    subChannelId,
    setStatus,
    channel,
    topicId,
    setIsNavigating,
    setIsPrfsDialogOpen,
  });

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
            <HoverableText>{i18n.add_required_proof}</HoverableText>
          </button>
          {requiredProofIdsAbbrev && (
            <div className={styles.proofId}>
              <p>+ {requiredProofIdsAbbrev}</p>
            </div>
          )}
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
            <button onClick={handleAddOtherProof} type="button">
              <HoverableText>{i18n.add_proof_optional}</HoverableText>
            </button>
            {otherProofIdsAbbrev && (
              <div className={styles.proofId}>
                <p>+ {otherProofIdsAbbrev}</p>
              </div>
            )}
          </div>
        )}
        <div className={styles.btnRow}>
          <Button variant="green_1" handleClick={handleCreateTopic} disabled={proofs.length < 1}>
            {status === Status.InProgress ? <Spinner /> : i18n.post}
          </Button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
      </div>
      <PrfsIdSessionDialog
        sessionKey={sessionKey}
        isPrfsDialogOpen={isPrfsDialogOpen}
        setIsPrfsDialogOpen={setIsPrfsDialogOpen}
        actionLabel={i18n.create_proof.toLowerCase()}
        handleSucceedGetSession={handleSucceedAddProofSession}
      />
      <PrfsIdSessionDialog
        sessionKey={sessionKey2}
        isPrfsDialogOpen={isPrfsDialogOpen2}
        setIsPrfsDialogOpen={setIsPrfsDialogOpen2}
        actionLabel={i18n.create_proof.toLowerCase()}
        handleSucceedGetSession={handleSucceedAddOtherProofSession}
      />
    </>
  );
};

export default CreateTopicForm;

export interface CreateTopicFormProps {
  channel: ShyChannel;
  subChannelId: string;
}
