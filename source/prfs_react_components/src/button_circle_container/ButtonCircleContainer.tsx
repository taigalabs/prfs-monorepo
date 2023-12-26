import React from "react";

import styles from "./ButtonCircleContainer.module.scss";

const ButtonCircleContainer: React.FC<ButtonCircleContainerProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default ButtonCircleContainer;

export interface ButtonCircleContainerProps {
  children: React.ReactNode;
}
