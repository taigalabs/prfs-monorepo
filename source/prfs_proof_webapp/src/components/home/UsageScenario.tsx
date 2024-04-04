import React from "react";
import ImageLogo from "@taigalabs/prfs-react-lib/src/image_logo/ImageLogo";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import cn from "classnames";

import styles from "./UsageScenario.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { Area, Title } from "./IntroComponents";

const UsageScenario: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();
  // const [tutorialLabel, setTutorialLabel] = React.useState(TutorialLabel.create_identity);

  // const handleClickItem = React.useCallback(
  //   (e: React.MouseEvent) => {
  //     const label = e.currentTarget.getAttribute("data-label");
  //     if (label) {
  //       setTutorialLabel(Number(label));
  //     }
  //   },
  //   [setTutorialLabel],
  // );

  return (
    <Area className={styles.wrapper}>
      <div className={styles.container}>
        power
        {/* {tutorialLabel === TutorialLabel.create_identity && ( */}
        {/*   <Iframe src="https://drive.google.com/file/d/1hyVmoqCExvPLMU9ABa7Vt6LaTw_D9dCV/preview" /> */}
        {/* )} */}
        {/* {tutorialLabel === TutorialLabel.create_proof && ( */}
        {/*   <Iframe src="https://drive.google.com/file/d/1if74zytTjTy-eShG9GzyCQzhfjN-cN4b/preview" /> */}
        {/* )} */}
        {/* {tutorialLabel === TutorialLabel.create_topic && ( */}
        {/*   <Iframe src="https://drive.google.com/file/d/1Hsic--IUT5LfRFpnRjmwvTcNYl3PDrGp/preview" /> */}
        {/* )} */}
      </div>
    </Area>
  );
};

export default UsageScenario;

export interface LogoContainerProps {}

export interface IframeProps {
  src: string;
}
