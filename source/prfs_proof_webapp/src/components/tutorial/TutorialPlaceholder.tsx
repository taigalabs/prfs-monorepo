"use client";

import React from "react";
import cn from "classnames";
import { useIsTutorial } from "@taigalabs/prfs-react-lib/src/hooks/tutorial";

import styles from "./TutorialPlaceholder.module.scss";

const TutorialPlaceholder: React.FC<TutorialPlaceholderProps> = () => {
  const isTutorial = useIsTutorial();

  return isTutorial && <div className={cn(styles.wrapper)} />;
};

export default TutorialPlaceholder;

export interface TutorialPlaceholderProps {}
