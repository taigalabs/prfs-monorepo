import React, { MouseEventHandler } from "react";
import cn from "classnames";
import { PiDotsNineBold } from "react-icons/pi";

import styles from "./IconButton.module.scss";

const IconButton: React.FC<IconButtonProps> = ({ className, handleClick, variant, disabled }) => {
  const iconElem = React.useMemo(() => {
    switch (variant) {
      case "dots":
        return <PiDotsNineBold />;
      default:
        null;
    }
  }, [variant]);

  return (
    <button
      className={cn({
        [styles.wrapper]: true,
        [styles.dots]: variant === "dots",
      })}
      onClick={handleClick}
      disabled={!!disabled}
    >
      {iconElem}
    </button>
  );
};

export default IconButton;

export interface IconButtonProps {
  variant: "dots";
  className?: string;
  disabled?: boolean;
  handleClick?: MouseEventHandler;
}
