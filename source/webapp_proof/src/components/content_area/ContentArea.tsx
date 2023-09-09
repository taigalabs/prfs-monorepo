import React from "react";

import styles from "./ContentArea.module.scss";

const ContentArea: React.FC<ContentAreaProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default ContentArea;

export interface ContentAreaProps {
  children: React.ReactNode;
}
