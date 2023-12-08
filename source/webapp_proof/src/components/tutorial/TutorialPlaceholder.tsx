"use client";

import React, { Suspense } from "react";
import cn from "classnames";

import styles from "./TutorialPlaceholder.module.scss";
import { useIsTutorial } from "@/hooks/tutorial";

const TutorialPlaceholder: React.FC<TutorialPlaceholderProps> = () => {
  const isTutorial = useIsTutorial();

  return (
    isTutorial && (
      <div
        className={cn(styles.wrapper, {
          // [styles.v1460]: variant === "v1460",
          // [styles.h1460]: variant === "h1460",
          // [styles.h1502]: variant === "h1502",
        })}
      >
        123123
      </div>
    )
  );
};

export default TutorialPlaceholder;

export interface TutorialPlaceholderProps {
  // variant: "v1460" | "h1460" | "h1502";
}
