import React from "react";
import cn from "classnames";

import styles from "./Overlay.module.scss";

const Overlay: React.FC<OverlayProps> = ({ children, className, zIndex, opacity, fixed }) => {
  return (
    <div
      className={cn(styles.overlay, className)}
      style={{ zIndex, opacity, position: fixed ? "fixed" : "absolute" }}
    >
      {children}
    </div>
  );
};

export default Overlay;

export interface OverlayProps {
  className?: string;
  zIndex?: number;
  children?: React.ReactNode;
  opacity?: number;
  fixed?: boolean;
}
