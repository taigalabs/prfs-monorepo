import React from "react";
import { useRouter } from "next/navigation";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { CreateShyTopicRequest } from "@taigalabs/shy-entities/bindings/CreateShyTopicRequest";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { ProofBlob } from "@taigalabs/shy-entities/bindings/ProofBlob";
import { shyApi2 } from "@taigalabs/shy-api-js";

import { pathParts, paths } from "@/paths";
import { useAppDispatch } from "@/state/hooks";
import { setGlobalMsg } from "@/state/globalMsgReducer";

export enum Status {
  Standby,
  InProgress,
}

export function useCreateTopic({
  setError,
  html,
  title,
  firstProof,
  otherProofs,
  subChannelId,
  setStatus,
  channel,
  topicId,
  setIsNavigating,
  setIsPrfsDialogOpen,
}: UseCreateTopicArgs) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { mutateAsync: createShyTopic } = useMutation({
    mutationFn: (req: CreateShyTopicRequest) => {
      return shyApi2({ type: "create_shy_topic", ...req });
    },
  });

  const handleCreateTopic = React.useCallback(async () => {
    setError(null);

    if (!html) {
      setError("Content needs to be present");
      return;
    }

    if (title.length < 1) {
      setError("Title needs to be present");
      return;
    }

    if (title.length < 4) {
      setError("Title needs to be longer");
      return;
    }

    if (title.length > 110) {
      setError("Title needs to be shorter");
      return;
    }

    if (html.length < 4) {
      setError(`Content needs to be longer, current length: ${html.length}`);
      return;
    }

    if (channel.proof_type_ids.length < 1) {
      setError("Proof type does not exist");
      return;
    }

    if (!firstProof) {
      setError("Proof is not added");
      return;
    }

    const {
      shy_proof_id,
      public_inputs,
      proof_identity_input,
      proof,
      author_public_key,
      serial_no,
      author_sig,
      author_sig_msg,
      proof_type_id,
    } = firstProof;

    setStatus(Status.InProgress);
    const { error } = await createShyTopic({
      title,
      topic_id: topicId,
      content: html,
      channel_id: channel.channel_id,
      shy_proof_id,
      proof_identity_input,
      proof,
      public_inputs,
      author_public_key,
      serial_no,
      author_sig,
      author_sig_msg,
      sub_channel_id: subChannelId,
      proof_type_id,
      proof_idx: 0,
      other_proofs: otherProofs,
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
  }, [
    channel,
    topicId,
    title,
    firstProof,
    subChannelId,
    otherProofs,
    setError,
    createShyTopic,
    router,
    setStatus,
    setIsNavigating,
    html,
    setIsPrfsDialogOpen,
  ]);

  return { handleCreateTopic };
}

export interface UseCreateTopicArgs {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  html: string | null;
  title: string;
  firstProof: ProofBlob | null;
  otherProofs: ProofBlob[];
  subChannelId: string;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  channel: ShyChannel;
  topicId: string;
  setIsNavigating: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPrfsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
