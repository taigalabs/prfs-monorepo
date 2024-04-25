import React from "react";
import cn from "classnames";

import styles from "./DemoVideo.module.scss";
import { HomeInner } from "./HomeComponents";

const DemoVideo: React.FC<LogoContainerProps> = ({}) => {
  return (
    <div className={styles.wrapper}>
      <HomeInner className={styles.inner}>
        <div
          className={styles.video}
          style={{
            padding: "56.25% 0 0 0",
            position: "relative",
          }}
        >
          <iframe
            src="https://player.vimeo.com/video/939085919?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            title="Prfs tutorial 1 - create an attestation and a zk proof"
          ></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </HomeInner>
    </div>
  );
};

export default DemoVideo;

export interface LogoContainerProps {}
