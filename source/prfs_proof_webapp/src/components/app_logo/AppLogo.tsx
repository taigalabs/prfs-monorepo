import React from "react";
import cn from "classnames";
import { IoIosMenu } from "@react-icons/all-files/io/IoIosMenu";
import ImageLogo from "@taigalabs/prfs-react-lib/src/image_logo/ImageLogo";

import styles from "./AppLogo.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";

const AppLogo: React.FC<AttestationsLogoAreaProps> = ({
  handleClickShowLeftBar,
  label,
  url,
  className,
}) => {
  const i18n = React.useContext(i18nContext);

  const handleClickHamburger = React.useCallback(() => {
    handleClickShowLeftBar();
  }, [handleClickShowLeftBar]);

  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={styles.hamburger} onClick={handleClickHamburger}>
        <IoIosMenu />
      </div>
      <a className={styles.logoArea} href={url}>
        <ImageLogo width={24} />
        <span>{i18n.proof}</span>
      </a>
    </div>
  );
};

export default AppLogo;

export interface AttestationsLogoAreaProps {
  handleClickShowLeftBar: (bool?: boolean) => void;
  url: string;
  label: string;
  className?: string;
}
