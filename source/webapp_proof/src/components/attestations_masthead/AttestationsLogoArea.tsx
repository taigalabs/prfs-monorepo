import React from "react";
import cn from "classnames";
import Link from "next/link";
import { IoIosMenu } from "@react-icons/all-files/io/IoIosMenu";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";

import styles from "./AttestationsLogoArea.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";

const AttestationsLogoArea: React.FC<AttestationsLogoAreaProps> = ({ handleClickShowLeftBar }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.hamburger} onClick={handleClickShowLeftBar}>
        <IoIosMenu />
      </div>
      <a className={styles.logoArea} href={paths.__}>
        <ImageLogo width={24} />
        <span>{i18n.acc_verification}</span>
      </a>
    </div>
  );
};

export default AttestationsLogoArea;

export interface AttestationsLogoAreaProps {
  handleClickShowLeftBar: () => void;
}
