import React, { Suspense } from "react";
import cn from "classnames";

import styles from "./TutorialPlaceholder.module.scss";

const TutorialPlaceholder: React.FC<TutorialPlaceholderProps> = ({ variant }) => {
  return <div className={cn(styles.wrapper, { [styles.v1460]: variant === "v1460" })}></div>;
};

export default TutorialPlaceholder;

export interface TutorialPlaceholderProps {
  variant: "v1460";
}
