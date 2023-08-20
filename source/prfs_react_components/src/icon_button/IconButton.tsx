import React, { MouseEventHandler } from "react";
import cn from "classnames";
import { PiDotsNineBold } from "react-icons/pi";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxHamburgerMenu } from "react-icons/rx";

import styles from "./IconButton.module.scss";

const IconButton: React.FC<IconButtonProps> = ({ className, handleClick, variant, disabled }) => {
  const iconElem = React.useMemo(() => {
    switch (variant) {
      case "dots":
        return <PiDotsNineBold />;
      case "hamburger":
        return <RxHamburgerMenu />;
      default:
        null;
    }
  }, [variant]);

  return (
    <button
      className={cn({
        [styles.wrapper]: true,
        [styles.dots]: variant === "dots",
        [styles.hamburger]: variant === "hamburger",
        [className as any]: !!className,
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
  variant: "dots" | "hamburger";
  className?: string;
  disabled?: boolean;
  handleClick?: MouseEventHandler;
}
