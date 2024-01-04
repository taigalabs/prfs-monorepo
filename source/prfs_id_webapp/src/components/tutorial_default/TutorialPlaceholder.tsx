import React from "react";
import cn from "classnames";
import { useTutorial } from "@taigalabs/prfs-react-lib/src/hooks/tutorial";

import styles from "./TutorialPlaceholder.module.scss";
import { TutorialArgs } from "@taigalabs/prfs-id-sdk-web";

const TutorialPlaceholder: React.FC<TutorialPlaceholderProps> = ({ tutorial }) => {
  return tutorial && <div className={cn(styles.wrapper)} />;
};

export default TutorialPlaceholder;

export interface TutorialPlaceholderProps {
  tutorial: TutorialArgs | undefined;
}
