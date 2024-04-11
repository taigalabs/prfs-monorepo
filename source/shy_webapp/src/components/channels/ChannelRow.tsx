import React from "react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { FiLock } from "@react-icons/all-files/fi/FiLock";
import Link from "next/link";
import {
  API_PATH,
  ProofGenArgs,
  ProofGenSuccessPayload,
  QueryType,
  createSessionKey,
  makeProofGenSearchParams,
  openPopup,
} from "@taigalabs/prfs-id-sdk-web";
import { createRandomKeyPair, decrypt, makeRandInt, rand256Hex } from "@taigalabs/prfs-crypto-js";
import { ShyChannelProofAction } from "@taigalabs/shy-entities/bindings/ShyChannelProofAction";
import { EnterShyChannelToken } from "@taigalabs/shy-entities/bindings/EnterShyChannelToken";
import { MerkleSigPosExactV1PresetVals } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosExactV1PresetVals";
import { usePrfsIdSession } from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/use_prfs_id_session";
import PrfsIdSessionDialog from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/PrfsIdSessionDialog";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { PrfsIdSession } from "@taigalabs/prfs-entities/bindings/PrfsIdSession";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { GenericProveReceipt, ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { useRouter } from "next/navigation";

import styles from "./ChannelRow.module.scss";
import { paths } from "@/paths";
import { SHY_APP_ID } from "@/app_id";
import { PROOF } from "@/proof_gen_args";
import { envs } from "@/envs";
import { useAppDispatch } from "@/state/hooks";
import { setGlobalMsg } from "@/state/globalMsgReducer";
import { useGetShyProof } from "@/hooks/proof";
import { useShyCache } from "@/hooks/user";
import { setCacheItem } from "@/state/userReducer";
import { make_enter_shy_channel_cache_key } from "@/cache";

const ChannelRow: React.FC<RowProps> = ({ channel }) => {
  const router = useRouter();
  const { shyCache, isCacheInitialized } = useShyCache();

  const i18n = usePrfsI18N();
  const {
    openPrfsIdSession,
    isPrfsDialogOpen,
    setIsPrfsDialogOpen,
    sessionKey,
    setSessionKey,
    sk,
    setSk,
  } = usePrfsIdSession();
  const dispatch = useAppDispatch();
  const url = React.useMemo(() => {
    return `${paths.c}/${channel.channel_id}`;
  }, [channel.channel_id]);

  const { mutateAsync: getShyProof } = useGetShyProof();

  const handleClickRow = React.useCallback(
    async (e: React.MouseEvent) => {
      if (channel.type === "Closed") {
        e.preventDefault();

        const session_key = createSessionKey();
        const { sk, pkHex } = createRandomKeyPair();
        const json = JSON.stringify({
          appId: SHY_APP_ID,
          channel_id: channel.channel_id,
          nonce: 0,
        });

        const proofAction: ShyChannelProofAction = {
          type: "enter_shy_channel",
          channel_id: channel.channel_id,
          nonce: 0,
        };

        const proofActionStr = JSON.stringify(proofAction);
        const presetVals: MerkleSigPosExactV1PresetVals = {
          nonceRaw: json,
        };
        const proofGenArgs: ProofGenArgs = {
          nonce: makeRandInt(1000000),
          app_id: SHY_APP_ID,
          queries: [
            {
              name: PROOF,
              proofTypeId: "nonce_seoul_v1",
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
      } else {
        router.push(url);
      }
    },
    [channel, router, url, setSk],
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
        const { payload: getShyProofPayload } = await getShyProof({
          public_key: receipt.proofPubKey,
        });

        if (getShyProofPayload?.shy_proof) {
          const shyProof = getShyProofPayload.shy_proof;
          const enterShyChannelToken: EnterShyChannelToken = {
            shy_proof_id: shyProof.shy_proof_id,
            sig: receipt.proofActionSig,
            sig_msg: Array.from(receipt.proofActionSigMsg),
          };

          dispatch(
            setCacheItem({
              key: make_enter_shy_channel_cache_key(channel.channel_id),
              val: JSON.stringify(enterShyChannelToken),
              ts: Date.now(),
            }),
          );
        } else {
        }
      } else if (receipt.type === "prove_receipt") {
        const shy_proof_id = rand256Hex();
        const receipt_ = receipt as ProveReceipt;
        console.log("receipt", receipt_);

        // const publicInputs: MerkleSigPosRangeV1PublicInputs = JSONbigNative.parse(
        //   receipt_.proof.publicInputSer,
        // );

        // const { error } = await createShyPostWithProof({
        //   topic_id: topicId,
        //   channel_id: channel.channel_id,
        //   shy_topic_proof_id,
        //   author_public_key: receipt_.proof.proofPubKey,
        //   post_id: postId,
        //   content: html,
        //   author_sig: receipt_.proofActionSig,
        //   author_sig_msg: Array.from(receipt_.proofActionSigMsg),
        //   proof_identity_input: publicInputs.proofIdentityInput,
        //   proof: Array.from(receipt.proof.proofBytes),
        //   public_inputs: receipt_.proof.publicInputSer,
        //   serial_no: publicInputs.circuitPubInput.serialNo.toString(),
        //   sub_channel_id: subChannelId,
        // });

        // if (error) {
        // }

        // handleSucceedPost();
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
    [sk, dispatch, getShyProof],
  );

  if (!isCacheInitialized) {
    return <Spinner />;
  }

  return (
    <>
      <Link href={url} onClick={handleClickRow}>
        <div className={styles.wrapper}>
          <div className={styles.labelRow}>
            <span className={styles.label}>{channel.label}</span>
            {channel.type === "Closed" && <FiLock className={styles.lock} />}
            <span className={styles.locale}>{channel.locale}</span>
          </div>
          <div
            className={styles.desc}
            dangerouslySetInnerHTML={{
              __html: channel.desc,
            }}
          />
        </div>
      </Link>
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

export default ChannelRow;

export interface RowProps {
  channel: ShyChannel;
}
