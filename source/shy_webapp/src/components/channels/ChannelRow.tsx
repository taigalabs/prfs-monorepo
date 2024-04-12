import React from "react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";
import { FiLock } from "@react-icons/all-files/fi/FiLock";
import Link from "next/link";
import PrfsIdSessionDialog from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/PrfsIdSessionDialog";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { useRouter } from "next/navigation";

import styles from "./ChannelRow.module.scss";
import { paths } from "@/paths";
import { useShyCache } from "@/hooks/user";
import { useHandleJoinShyChannel } from "@/hooks/join_shy_channel";
import Button from "../button/Button";

const ChannelRow: React.FC<RowProps> = ({ channel }) => {
  const router = useRouter();
  const { shyCache, isCacheInitialized } = useShyCache();
  const i18n = usePrfsI18N();
  const [showEnter, setShowEnter] = React.useState(false);

  const url = React.useMemo(() => {
    return `${paths.c}/${channel.channel_id}`;
  }, [channel.channel_id]);

  console.log(!1, styles);

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
        setShowEnter(v => !v);
      } else {
        router.push(url);
      }
    },
    [channel, router, url, setShowEnter],
  );

  const handleClickEnter = React.useCallback(
    async (e: React.MouseEvent) => {
      if (channel.type === "Closed") {
        e.preventDefault();
        e.stopPropagation();
        handleJoinShyChannel();
      } else {
        router.push(url);
      }
    },
    [channel, router, url],
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
          {showEnter && (
            <div className={styles.enterMenu}>
              <Button variant="green_1" handleClick={handleClickEnter}>
                {i18n.enter}
              </Button>
              <p className={styles.enterDesc}>This channel requires proof to enter</p>
            </div>
          )}
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
