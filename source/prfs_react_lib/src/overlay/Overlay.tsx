import React from "react";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";

import styles from "./Overlay.module.scss";

const Overlay: React.FC<OverlayProps> = ({ children, zIndex, opacity }) => {
  return (
    <div className={styles.overlay} style={{ zIndex, opacity }}>
      {children}
    </div>
  );
};

export default Overlay;

export interface OverlayProps {
  zIndex?: number;
  children?: React.ReactNode;
  opacity?: number;
}
