import React from "react";
import cn from "classnames";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";

import styles from "./ProjectStatus.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { Area, Subtitle } from "./IntroComponents";

const ProjectStatus: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();

  return (
    <div className={styles.wrapper}>
      <Area>
        <Subtitle>
          <div>
            We are currently participating in the{" "}
            <a href="https://consensys.io/fellowship" target="_blank">
              <HoverableText>Consensys fellowship program</HoverableText>
            </a>{" "}
            ('23-Present)
          </div>
        </Subtitle>
        <div className={styles.links}>
          <img
            className={styles.appLogo}
            src="https://d1w1533jipmvi2.cloudfront.net/Consensys_logo_2023.svg.png"
          />
          <div className={styles.tweet}>
            <a href="https://x.com/Consensys/status/1721602564775395502?s=20" target="_blank">
              <HoverableText>[Tweet]</HoverableText>
            </a>
          </div>
        </div>
      </Area>
    </div>
  );
};

export default ProjectStatus;

export interface LogoContainerProps {}
