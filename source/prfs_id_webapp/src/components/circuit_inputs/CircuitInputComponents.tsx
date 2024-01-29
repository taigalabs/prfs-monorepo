import React, { HTMLInputTypeAttribute } from "react";
import cn from "classnames";

import styles from "./CircuitInputComponents.module.scss";

export const FormInputButton: React.FC<AttestationsProps> = ({ children, className }) => {
  return <div className={cn(styles.formInputBtn, className)}>{children}</div>;
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
