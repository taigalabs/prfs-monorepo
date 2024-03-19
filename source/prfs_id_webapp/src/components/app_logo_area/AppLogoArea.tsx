import React, { HTMLInputTypeAttribute } from "react";
import ImageLogo from "@taigalabs/prfs-react-lib/src/image_logo/ImageLogo";
import cn from "classnames";

import styles from "./AppLogoArea.module.scss";

export const AppLogoArea: React.FC<AppLogoAreaProps> = ({ className, subLabel }) => {
  return (
    <div className={styles.wrapper}>
      <ImageLogo className={styles.imageLogo} />
      {subLabel && <span>ID</span>}
    </div>
  );
};

export default AppLogoArea;

export interface AppLogoAreaProps {
  className?: string;
  subLabel?: string;
}
