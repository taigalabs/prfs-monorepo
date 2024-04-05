import React from "react";
import cn from "classnames";
import { MdArrowForward } from "@react-icons/all-files/md/MdArrowForward";
import { MdArrowUpward } from "@react-icons/all-files/md/MdArrowUpward";
import { FaMobileAlt } from "@react-icons/all-files/fa/FaMobileAlt";
import { TbCertificate } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbCertificate";
import { TbMathPi } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbMathPi";
import Link from "next/link";

import styles from "./FeatureList.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { paths } from "@/paths";
import { Title } from "./IntroComponents";

const FeatureList: React.FC<LogoContainerProps> = ({ handleFocusSearchBar }) => {
  const i18n = useI18N();

  return (
    <div className={styles.wrapper}>
      <div className={cn(styles.item, styles.gray)}>
        <div className={styles.box}>
          <div className={styles.image}>
            <img
              src="https://d1w1533jipmvi2.cloudfront.net/prfs_proof_example_1.png"
              crossOrigin="anonymous"
              alt="Proof example"
            />
          </div>
          <div className={styles.itemContent}>
            <div className={styles.inner}>
              <p className={styles.title}>Create a zero-knowledge proof on your own</p>
              <p className={styles.desc}>
                It is important that you are able to create a proof with minimal reliance on others.
                Prfs is designed to allow you to make an anonymous claim by yourself.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.box}>
          <div className={styles.image}>
            <img
              src="https://d1w1533jipmvi2.cloudfront.net/prfs_atst_example_1.png"
              crossOrigin="anonymous"
              alt="Prfs attestation example"
            />
          </div>
          <div className={styles.itemContent}>
            <div className={styles.inner}>
              <p className={styles.title}>
                Attest to your data to create an anonymous claim about it
              </p>
              <p className={styles.desc}>
                When you attest to your data, the data that would anyway be available on the open
                space, it becomes much efficient for you to generate a proof.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={cn(styles.item, styles.gray)}>
        <div className={styles.box}>
          <div className={styles.image}>
            <img
              src="https://d1w1533jipmvi2.cloudfront.net/prfs_id_example_1.png"
              crossOrigin="anonymous"
              alt="Prfs Id example"
            />
          </div>
          <div className={styles.itemContent}>
            <div className={styles.inner}>
              <p className={styles.title}>Use the Internet more safely on any device you have</p>
              <p className={styles.desc}>
                Prfs Id is designed to give you a similar experience you get when using other web
                applications. Use security-enhanced apps on devices that you are already used to
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureList;

export interface LogoContainerProps {
  handleFocusSearchBar: () => void;
}
