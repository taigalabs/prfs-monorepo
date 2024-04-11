import React from "react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { FiLock } from "@react-icons/all-files/fi/FiLock";
import Link from "next/link";
import {
  API_PATH,
  ProofGenArgs,
  QueryType,
  createSessionKey,
  makeProofGenSearchParams,
  openPopup,
} from "@taigalabs/prfs-id-sdk-web";
import { createRandomKeyPair, makeRandInt } from "@taigalabs/prfs-crypto-js";
import { ShyChannelProofAction } from "@taigalabs/shy-entities/bindings/ShyChannelProofAction";
import { MerkleSigPosExactV1PresetVals } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosExactV1PresetVals";
import { useRouter } from "next/navigation";

import styles from "./ChannelRow.module.scss";
import { paths } from "@/paths";
import { SHY_APP_ID } from "@/app_id";
import { PROOF } from "@/proof_gen_args";
import { envs } from "@/envs";
import { usePrfsIdSession } from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/use_prfs_id_session";
import PrfsIdSessionDialog from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/PrfsIdSessionDialog";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";

const ChannelRow: React.FC<RowProps> = ({ channel }) => {
  const router = useRouter();
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
  const url = React.useMemo(() => {
    return `${paths.c}/${channel.channel_id}`;
  }, [channel.channel_id]);

  const handleClickRow = React.useCallback(
    async (e: React.MouseEvent) => {
      if (channel.type === "Closed") {
        e.preventDefault();

        const proofTypeId = channel.proof_type_ids[0];
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
        // setSk(sk);
        // setHtml(html);
      } else {
        router.push(url);
      }
    },
    [channel, router, url, setSk],
  );

  const handleSucceedGetSession = React.useCallback(() => {}, []);

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
