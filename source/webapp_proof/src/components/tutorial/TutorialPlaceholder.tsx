import React, { Suspense } from "react";
import cn from "classnames";

import styles from "./TutorialPlaceholder.module.scss";

const TutorialPlaceholder: React.FC = () => {
  return <div className={styles.wrapper}></div>;
};

export default TutorialPlaceholder;
