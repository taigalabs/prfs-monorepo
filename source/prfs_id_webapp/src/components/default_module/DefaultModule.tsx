import React, { HTMLInputTypeAttribute } from "react";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";
import cn from "classnames";

import styles from "./DefaultModule.module.scss";

export const DefaultModuleLogoArea: React.FC = () => {
  return (
    <div className={styles.logoArea}>
      <ImageLogo width={46} />
      <span>ID</span>
    </div>
  );
};

export const DefaultModuleHeader: React.FC<DefaultModuleInputAreaProps> = ({
  children,
  noTopPadding,
}) => {
  return (
    <div className={cn(styles.header, { [styles.noTopPadding]: noTopPadding })}>{children}</div>
  );
};

export const DefaultModuleTitle: React.FC<DefaultModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.title}>{children}</div>;
};

export const DefaultModuleSubtitle: React.FC<DefaultModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.subtitle}>{children}</div>;
};

export const DefaultModuleInputArea: React.FC<DefaultModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.inputArea}>{children}</div>;
};

export const DefaultModuleFooter: React.FC<DefaultModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.footer}>{children}</div>;
};

export const DefaultErrorMsg: React.FC<DefaultModuleInputAreaProps> = ({ children, className }) => {
  return <div className={cn(styles.error, className)}>{children}</div>;
};

export const DefaultModuleBtnRow: React.FC<DefaultModuleInputAreaProps> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.btnRow, className)}>{children}</div>;
};

export const DefaultInputItem: React.FC<DefaultModuleInputProps> = ({
  className,
  name,
  value,
  error,
  type,
  placeholder,
  handleChangeValue,
  handleKeyDown,
}) => {
  return (
    <div
      className={cn(styles.inputItem, className, {
        [styles.isError]: !!error,
      })}
    >
      <input
        name={name}
        value={value}
        className={styles.input}
        placeholder={placeholder}
        type={type}
        onChange={handleChangeValue}
        onKeyDown={handleKeyDown}
      />
      {error && error.length && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export const DefaultInputGuide: React.FC<DefaultModuleInputAreaProps> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.inputGuide, className)}>{children}</div>;
};

export const DefaultForm: React.FC<DefaultModuleInputAreaProps> = ({ children }) => {
  return <form className={styles.form}>{children}</form>;
};

export const DefaultInnerPadding: React.FC<DefaultModuleInputAreaProps> = ({
  children,
  noSidePadding,
}) => {
  return (
    <div className={cn(styles.innerPadding, { [styles.noSidePadding]: noSidePadding })}>
      {children}
    </div>
  );
};

export const DefaultTopLabel: React.FC<DefaultModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.topLabel}>{children}</div>;
};

export const DefaultModule: React.FC<DefaultModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export interface DefaultModuleInputAreaProps {
  className?: string;
  noTopPadding?: boolean;
  noSidePadding?: boolean;
  children: React.ReactNode;
}

export interface DefaultModuleInputProps {
  className?: string;
  name?: string;
  value: string;
  handleChangeValue: React.ChangeEventHandler;
  handleKeyDown?: React.KeyboardEventHandler;
  error: string | undefined;
  placeholder?: string;
  type?: HTMLInputTypeAttribute | undefined;
}
