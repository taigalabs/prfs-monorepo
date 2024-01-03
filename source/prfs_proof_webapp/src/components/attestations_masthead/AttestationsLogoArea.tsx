import React from "react";
import cn from "classnames";
import { IoIosMenu } from "@react-icons/all-files/io/IoIosMenu";
import ImageLogo from "@taigalabs/prfs-react-lib/src/image_logo/ImageLogo";

import styles from "./AttestationsLogoArea.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";

const AttestationsLogoArea: React.FC<AttestationsLogoAreaProps> = ({ handleClickShowLeftBar }) => {
  const i18n = React.useContext(i18nContext);

  const handleClickHamburger = React.useCallback(() => {
    handleClickShowLeftBar();
  }, [handleClickShowLeftBar]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.hamburger} onClick={handleClickHamburger}>
        <IoIosMenu />
      </div>
      <a className={styles.logoArea} href={paths.__}>
        <ImageLogo width={24} />
        <span>{i18n.attestations}</span>
      </a>
    </div>
  );
};

export default AttestationsLogoArea;

export interface AttestationsLogoAreaProps {
  handleClickShowLeftBar: (bool?: boolean) => void;
}
