"use client";

import React from "react";
import cn from "classnames";

import styles from "./TutorialPlaceholder.module.scss";
import { useIsTutorial } from "@/hooks/tutorial";

const TutorialPlaceholder: React.FC<TutorialPlaceholderProps> = () => {
  const isTutorial = useIsTutorial();

  return isTutorial && <div className={cn(styles.wrapper)} />;
};

export default TutorialPlaceholder;

export interface TutorialPlaceholderProps {}
