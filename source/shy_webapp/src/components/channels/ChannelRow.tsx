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
import {
  JSONbigNative,
  createRandomKeyPair,
  decrypt,
  makeRandInt,
  rand256Hex,
} from "@taigalabs/prfs-crypto-js";
import { ShyChannelProofAction } from "@taigalabs/shy-entities/bindings/ShyChannelProofAction";
import { EnterShyChannelToken } from "@taigalabs/shy-entities/bindings/EnterShyChannelToken";
import { MerkleSigPosExactV1PresetVals } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosExactV1PresetVals";
import { usePrfsIdSession } from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/use_prfs_id_session";
import PrfsIdSessionDialog from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/PrfsIdSessionDialog";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { PrfsIdSession } from "@taigalabs/prfs-entities/bindings/PrfsIdSession";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { GenericProveReceipt, ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { MerkleSigPosExactV1PublicInputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosExactV1PublicInputs";
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
import { removeCacheItem, setCacheItem } from "@/state/userReducer";
import { makeEnterShyChannelCacheKey } from "@/cache";
import { useJoinShyChannel } from "@/hooks/channel";
import { useHandleJoinShyChannel } from "@/hooks/join_shy_channel";

const ChannelRow: React.FC<RowProps> = ({ channel }) => {
  const router = useRouter();
  const { shyCache, isCacheInitialized } = useShyCache();
  const i18n = usePrfsI18N();

  const url = React.useMemo(() => {
    return `${paths.c}/${channel.channel_id}`;
  }, [channel.channel_id]);

  const {
    handleJoinShyChannel,
    handleSucceedGetSession,
    sessionKey,
    isPrfsDialogOpen,
    setIsPrfsDialogOpen,
  } = useHandleJoinShyChannel({
    channel,
  });

  const handleClickRow = React.useCallback(
    async (e: React.MouseEvent) => {
      if (channel.type === "Closed") {
        e.preventDefault();
        handleJoinShyChannel();
      } else {
        router.push(url);
      }
    },
    [channel, router, url, shyCache],
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
