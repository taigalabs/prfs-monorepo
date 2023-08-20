import React, { MouseEventHandler } from "react";
import classnames from "classnames";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { AiOutlineArrowRight } from "react-icons/ai";
import { AiOutlineArrowUp } from "react-icons/ai";
import { AiOutlineArrowDown } from "react-icons/ai";

import styles from "./ArrowButton.module.scss";

const ArrowButton: React.FC<ArrowButtonProps> = ({ className, handleClick, variant, disabled }) => {
  const iconElem = React.useMemo(() => {
    switch (variant) {
      case "up":
        return <AiOutlineArrowUp />;
      case "down":
        return <AiOutlineArrowDown />;
      case "left":
        return <AiOutlineArrowLeft />;
      case "right":
        return <AiOutlineArrowRight />;
      default:
        null;
    }
  }, [variant]);

  return (
    <button className={styles.wrapper} onClick={handleClick} disabled={!!disabled}>
      {iconElem}
    </button>
  );
};

export default ArrowButton;

export interface ArrowButtonProps {
  variant: "up" | "down" | "left" | "right";
  className?: string;
  disabled?: boolean;
  handleClick?: MouseEventHandler;
}
