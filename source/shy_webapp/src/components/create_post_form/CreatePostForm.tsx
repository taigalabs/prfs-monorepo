import React from "react";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
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
import { createRandomKeyPair, decrypt, makeRandInt, rand256Hex } from "@taigalabs/prfs-crypto-js";
import { useRouter } from "next/navigation";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";

import styles from "./CreatePostForm.module.scss";
import { paths } from "@/paths";
import TextEditor from "@/components/text_editor/TextEditor";
import { useI18N } from "@/i18n/hook";
import { envs } from "@/envs";

const PROOF = "Proof";

const CreatePostForm: React.FC<CreatePostFormProps> = ({ channel }) => {
  const i18n = useI18N();
  const router = useRouter();

  const [postId, shortId] = React.useMemo(() => {
    const hex = rand256Hex();
    return [hex, hex.substring(0, 10)];
  }, []);
  // const { mutateAsync: createSocialPost } = useMutation({
  //   mutationFn: (req: CreateShyPostRequest) => {
  //     return shyApi2({ type: "create_shy_post", ...req });
  //   },
  // });
  //
  const handleClickPost = React.useCallback(
    async (html: string) => {
      if (channel.proof_type_ids.length < 1) {
        return;
      }
      const proofTypeId = channel.proof_type_ids[0];

      const session_key = createSessionKey();
      const { sk, pkHex } = createRandomKeyPair();

      const proofGenArgs: ProofGenArgs = {
        nonce: makeRandInt(1000000),
        app_id: "prfs_proof",
        queries: [
          {
            name: PROOF,
            proofTypeId,
            queryType: QueryType.CREATE_PROOF,
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

        let payload: ProofGenSuccessPayload;
        try {
          payload = JSON.parse(decrypted) as ProofGenSuccessPayload;
        } catch (err) {
          console.error("cannot parse payload", err);
          return;
        }

        //     const post_id = uuidv4();
        //     const post: ShyPost = {
        //       post_id,
        //       content: html,
        //       channel_id: "default",
        //     };

        //     const { payload } = await createSocialPost({ post });
        //     console.log("create social post resp", payload);

        const proof = payload.receipt[PROOF] as ProveReceipt;
        // if (proof) {
        //   handleCreateProofResult(proof);
        // } else {
        //   console.error("no proof delivered");
        //   return;
        // }
      } catch (err) {
        console.error(err);
      }

      // ws.close();
      // popup.close();
    },
    [channel],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <span>{i18n.create_a_post}</span>
        <span> ({shortId}...)</span>
      </div>
      <div className={styles.titleInput}>
        <input type="text" placeholder={i18n.what_is_this_discussion_about_in_one_sentence} />
      </div>
      <div className={styles.editorWrapper}>
        <TextEditor handleClickPost={handleClickPost} />
      </div>
    </div>
  );
};

export default CreatePostForm;

export interface CreatePostFormProps {
  channel: ShyChannel;
}
