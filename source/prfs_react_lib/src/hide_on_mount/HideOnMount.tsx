import React from "react";

import styles from "./HideOnMount.module.scss";

const HideOnMount: React.FC<HideOnMountProps> = ({ children }) => {
  const [show, setShow] = React.useState(true);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    timerRef.current = Date.now();
  }, [setShow, timerRef]);

  return <div>{children}</div>;
};

export default HideOnMount;

export interface HideOnMountProps {
  children: React.ReactNode;
}
