import React from "react";
import ImageLogo from "@taigalabs/prfs-react-lib/src/image_logo/ImageLogo";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import cn from "classnames";

import styles from "./TutorialArea.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { Title } from "./IntroComponents";

enum TutorialLabel {
  create_identity,
  create_proof,
  create_topic,
}

const Iframe: React.FC<IframeProps> = ({ src }) => {
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.addEventListener("load", function () {
        setIsLoaded(true);
      });
    }
  }, [setIsLoaded]);

  return (
    <div className={cn(styles.iframe)}>
      <iframe className={cn(styles.video)} src={src} allow="autoplay" ref={iframeRef} />
      {!isLoaded && (
        <div className={styles.overlay}>
          <Spinner />
        </div>
      )}
    </div>
  );
};

const TutorialArea: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();
  const [tutorialLabel, setTutorialLabel] = React.useState(TutorialLabel.create_identity);

  const handleClickItem = React.useCallback(
    (e: React.MouseEvent) => {
      const label = e.currentTarget.getAttribute("data-label");
      if (label) {
        setTutorialLabel(Number(label));
      }
    },
    [setTutorialLabel],
  );

  return (
    <div className={cn(styles.wrapper)}>
      <Title>{i18n.learn_by_tutorials}</Title>
      <ol className={styles.list}>
        <li
          className={cn({ [styles.isActive]: tutorialLabel === TutorialLabel.create_identity })}
          data-label={TutorialLabel.create_identity}
          onClick={handleClickItem}
        >
          Create an identity and attest to your data
        </li>
        <li
          className={cn({ [styles.isActive]: tutorialLabel === TutorialLabel.create_proof })}
          data-label={TutorialLabel.create_proof}
          onClick={handleClickItem}
        >
          Create and verify proof
        </li>
        <li
          className={cn({ [styles.isActive]: tutorialLabel === TutorialLabel.create_topic })}
          data-label={TutorialLabel.create_topic}
          onClick={handleClickItem}
        >
          (Live app - Shy) Create a topic and comment
        </li>
      </ol>
      <div className={styles.videoContainer}>
        {tutorialLabel === TutorialLabel.create_identity && (
          <Iframe src="https://drive.google.com/file/d/1hyVmoqCExvPLMU9ABa7Vt6LaTw_D9dCV/preview" />
        )}
        {tutorialLabel === TutorialLabel.create_proof && (
          <Iframe src="https://drive.google.com/file/d/1if74zytTjTy-eShG9GzyCQzhfjN-cN4b/preview" />
        )}
        {tutorialLabel === TutorialLabel.create_topic && (
          <Iframe src="https://drive.google.com/file/d/1Hsic--IUT5LfRFpnRjmwvTcNYl3PDrGp/preview" />
        )}
      </div>
    </div>
  );
};

export default TutorialArea;

export interface LogoContainerProps {}

export interface IframeProps {
  src: string;
}
