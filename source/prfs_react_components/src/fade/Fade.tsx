import React from "react";

import styles from "./Fade.module.scss";

const Fade: React.FC<FadeProps> = ({ children }) => {
  const [opacity, setOpacity] = React.useState(0);

  React.useEffect(() => {
    setTimeout(() => {
      setOpacity(1);
    }, 50);
  }, [setOpacity]);

  return (
    <div
      className={styles.wrapper}
      style={{
        opacity,
      }}
    >
      {children}
    </div>
  );
};

export default Fade;

export interface FadeProps {
  children: React.ReactNode;
}
