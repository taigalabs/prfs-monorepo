import { Component, JSX } from "solid-js";
import classnames from "classnames";

import styles from "./Button.module.scss";

const Button: Component<Button1Props> = ({ children, handleClick, variant }) => {
  return (
    <button
      class={classnames({
        [styles.a]: variant === "a",
        [styles.b]: variant === "b",
        [styles.transparent_a]: variant === "transparent_a",
      })}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Button;

export interface Button1Props {
  variant: "a" | "b" | "transparent_a";
  children: JSX.Element;
  handleClick?: JSX.EventHandlerUnion<any, MouseEvent>;
}
