import React from "react";

import styles from "./DefaultLayout.module.scss";
import { useAppSelector } from "@/state/hooks";

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children, }) => {
  const { top, left } = useAppSelector(state => state.ui.innerPos);
  const opacity = useAppSelector(state => state.ui.innerOpacity);

  return (
    <div
      className={styles.wrapper}
      style={{
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        opacity,
        // height: docHeight,
        // width: docWidth,
      }}
    >
      {children}
    </div>
  );
};

export default DefaultLayout;

export interface DefaultLayoutProps {
  children: React.ReactNode;
  // docHeight: number;
  // docWidth: number;
}
