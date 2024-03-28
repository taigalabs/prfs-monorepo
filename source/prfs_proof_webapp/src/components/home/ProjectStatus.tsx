import React from "react";
import cn from "classnames";
import { MdArrowForward } from "@react-icons/all-files/md/MdArrowForward";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";
import Link from "next/link";

import styles from "./ProjectStatus.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { urls } from "@/urls";
import { paths } from "@/paths";
import { Area, Subtitle, Title } from "./IntroComponents";

const ProjectStatus: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();

  return (
    <Area className={styles.wrapper}>
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
  );
};

export default ProjectStatus;

export interface LogoContainerProps {}
