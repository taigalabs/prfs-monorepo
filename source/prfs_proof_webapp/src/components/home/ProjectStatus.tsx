import React from "react";
import cn from "classnames";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";

import styles from "./ProjectStatus.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { Area, Subtitle } from "./HomeComponents";

const ProjectStatus: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();

  return (
    <div className={styles.wrapper}>
      <Area className={styles.area}>
        <Subtitle>
          <div>
            Participated in the{" "}
            <a href="https://consensys.io/fellowship" target="_blank">
              <HoverableText>Consensys fellowship program</HoverableText>
            </a>{" "}
            (2023)
          </div>
        </Subtitle>
        <div className={styles.links}>
          <img
            className={styles.appLogo}
            src="https://d1w1533jipmvi2.cloudfront.net/Consensys_logo_2023.svg.png"
          />
        </div>
      </Area>
    </div>
  );
};

export default ProjectStatus;

export interface LogoContainerProps {}
