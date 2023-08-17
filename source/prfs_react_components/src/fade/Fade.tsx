import React from "react";

import styles from "./Fade.module.scss";

const Fade: React.FC<FadeProps> = ({ children }) => {
  const [opacity, setOpacity] = React.useState(0);

  React.useEffect(() => {
    setOpacity(1);
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
