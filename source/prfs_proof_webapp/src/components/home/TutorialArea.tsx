import React from "react";
import ImageLogo from "@taigalabs/prfs-react-lib/src/image_logo/ImageLogo";
import cn from "classnames";

import styles from "./TutorialArea.module.scss";
import { useI18N } from "@/i18n/use_i18n";

const TutorialArea: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();

  return <div className={cn(styles.wrapper)}></div>;
};

export default TutorialArea;

export interface LogoContainerProps {}
