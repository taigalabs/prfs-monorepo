import React from "react";
import cn from "classnames";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";

import styles from "./ChannelNotice.module.scss";
import { envs } from "@/envs";

const Video = () => {
  return (
    <div className={styles.videoWrapper}>
      <div className={styles.video} style={{ padding: "75% 0 0 0", position: "relative" }}>
        <iframe
          src="https://player.vimeo.com/video/942264038?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          title="Shy tutorial 1 - Verified anon social"
        ></iframe>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </div>
    </div>
  );
};

const ChannelNotice: React.FC<ChannelNoticeProps> = ({}) => {
  const i18n = usePrfsI18N();

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <div className={cn(styles.section, styles.videoSection)}>
          <Video />
        </div>
        <div className={styles.section}>
          <p>
            Shy is an anonymous social using proof of credentials. To start, you need to have your
            data attested.
          </p>
          <div className={styles.sectionRow}>
            <a href={envs.NEXT_PUBLIC_PRFS_PROOF_WEBAPP_ENDPOINT}>
              <button className={styles.atstBtn}>Start with attestation</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelNotice;

export interface ChannelNoticeProps {}
