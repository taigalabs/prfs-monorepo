import React, { HTMLInputTypeAttribute } from "react";
import cn from "classnames";

import styles from "./CircuitInputComponents.module.scss";

export const FormInputButton: React.FC<AttestationsProps> = ({ children, className }) => {
  return (
    <button type="button" className={cn(styles.formInputBtn, className)}>
      {children}
    </button>
  );
};

export interface AttestationsProps {
  children: React.ReactNode;
  className?: string;
  innerRef?: React.MutableRefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
}

export interface AttestationsProps {
  children: React.ReactNode;
  className?: string;
  innerRef?: React.MutableRefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
  type?: HTMLInputTypeAttribute | undefined;
}
