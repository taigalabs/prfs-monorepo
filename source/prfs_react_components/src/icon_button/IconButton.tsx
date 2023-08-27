import React, { MouseEventHandler } from "react";
import cn from "classnames";
import { DotsNine } from "@phosphor-icons/react";
import { GiHamburgerMenu } from "@react-icons/all-files/gi/GiHamburgerMenu";

import styles from "./IconButton.module.scss";

const IconButton: React.FC<IconButtonProps> = ({ className, handleClick, variant, disabled }) => {
  const iconElem = React.useMemo(() => {
    switch (variant) {
      case "dots":
        return <DotsNine />;
      case "hamburger":
        return <GiHamburgerMenu />;
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
