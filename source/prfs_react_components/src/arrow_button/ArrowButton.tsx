import React, { MouseEventHandler } from "react";
import cn from "classnames";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { AiOutlineArrowRight } from "react-icons/ai";
import { AiOutlineArrowUp } from "react-icons/ai";
import { AiOutlineArrowDown } from "react-icons/ai";
import { MdOutlineArrowDropDown } from "react-icons/md";

import styles from "./ArrowButton.module.scss";

const ArrowButton: React.FC<ArrowButtonProps> = ({ className, handleClick, variant, disabled }) => {
  const iconElem = React.useMemo(() => {
    switch (variant) {
      case "up":
        return <AiOutlineArrowUp />;
      case "down":
        return <AiOutlineArrowDown />;
      case "down_small":
        return <MdOutlineArrowDropDown />;
      case "left":
        return <AiOutlineArrowLeft />;
      case "right":
        return <AiOutlineArrowRight />;
      default:
        null;
    }
  }, [variant]);

  return (
    <button
      className={cn({ [styles.wrapper]: true, [styles.small]: variant === "down_small" })}
      onClick={handleClick}
      disabled={!!disabled}
    >
      {iconElem}
    </button>
  );
};

export default ArrowButton;

export interface ArrowButtonProps {
  variant: "up" | "down" | "left" | "right" | "down_small";
  className?: string;
  disabled?: boolean;
  handleClick?: MouseEventHandler;
}
