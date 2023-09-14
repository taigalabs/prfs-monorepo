import React from "react";
import cn from "classnames";

import styles from "./Fade.module.scss";

const Fade: React.FC<FadeProps> = ({ children, className }) => {
  const [opacity, setOpacity] = React.useState(0);

  React.useEffect(() => {
    setTimeout(() => {
      setOpacity(1);
    }, 50);
  }, [setOpacity]);

  return (
    <div
      className={cn(styles.wrapper, className)}
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
  className?: string;
}
