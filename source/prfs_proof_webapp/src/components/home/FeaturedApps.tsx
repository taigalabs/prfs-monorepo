import React from "react";
import cn from "classnames";
import { MdArrowForward } from "@react-icons/all-files/md/MdArrowForward";
import { MdArrowUpward } from "@react-icons/all-files/md/MdArrowUpward";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";
import { TbCertificate } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbCertificate";
import { TbMathPi } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbMathPi";
import Link from "next/link";

import styles from "./FeaturedApps.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { urls } from "@/urls";
import { paths } from "@/paths";
import { Area, Subtitle, Title } from "./IntroComponents";

const FeaturedApps: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();

  return (
    <Area className={styles.wrapper}>
      <div className={styles.inner}>
        <Title>{i18n.featured_applications}</Title>
        <Subtitle>
          Prfs is empowering applications to make use of the latest ZKP technology
        </Subtitle>
        <ul className={styles.itemContainer}>
          <li className={cn(styles.item)}>
            <div className={styles.title}>
              <img
                className={styles.logo}
                src="https://d1w1533jipmvi2.cloudfront.net/shy_s_logo_192.png"
              />
              Shy
            </div>
            <p className={styles.desc}>
              Anonymous discussion forum powered by zkp. Chat with the proof of assets.
            </p>
            <div className={styles.callToAction}>
              <p>
                <a href="https://www.shy.chat">
                  Learn more
                  <MdArrowForward />
                </a>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </Area>
  );
};

export default FeaturedApps;

export interface LogoContainerProps {}
