import React from "react";
import cn from "classnames";

import styles from "./FormInputButton.module.scss";

export const FormInputButton: React.FC<FormInputButtonProps> = ({ children, className }) => {
  return (
    <button type="button" className={cn(styles.wrapper, className)}>
      {children}
    </button>
  );
};

export interface FormInputButtonProps {
  children: React.ReactNode;
  className?: string;
}
