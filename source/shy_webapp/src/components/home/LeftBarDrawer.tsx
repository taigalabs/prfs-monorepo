import React from "react";
import cn from "classnames";
import { FloatingPortal } from "@floating-ui/react";

import styles from "./Home.module.scss";
import { i18nContext } from "@/contexts/i18n";

const LeftBarDrawer: React.FC<LeftBarDrawerProps> = ({ children, isOpen, setIsOpen }) => {
  const handleClickOverlay = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <>
      <FloatingPortal>
        {isOpen && <div className={styles.overlay} onClick={handleClickOverlay} />}
        {true && <div className={cn(styles.drawer, { [styles.isOpen]: isOpen })}>{children}</div>}
      </FloatingPortal>
    </>
  );
};

export default LeftBarDrawer;

export interface LeftBarDrawerProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (bool?: boolean) => void;
}
