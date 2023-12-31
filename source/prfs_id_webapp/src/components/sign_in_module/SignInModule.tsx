import React, { HTMLInputTypeAttribute } from "react";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";
import cn from "classnames";

import styles from "./SignInModule.module.scss";

export const SignInModuleLogoArea: React.FC = () => {
  return (
    <div className={styles.logoArea}>
      <ImageLogo width={46} />
      <span>ID</span>
    </div>
  );
};

export const SignInModuleHeader: React.FC<PrfsIdSignInModuleInputAreaProps> = ({
  children,
  noTopPadding,
}) => {
  return (
    <div className={cn(styles.header, { [styles.noTopPadding]: noTopPadding })}>{children}</div>
  );
};

export const SignInModuleTitle: React.FC<PrfsIdSignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.title}>{children}</div>;
};

export const SignInModuleSubtitle: React.FC<PrfsIdSignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.subtitle}>{children}</div>;
};

export const SignInModuleInputArea: React.FC<PrfsIdSignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.inputArea}>{children}</div>;
};

export const SignInModuleFooter: React.FC<PrfsIdSignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.footer}>{children}</div>;
};

export const SignInErrorMsg: React.FC<PrfsIdSignInModuleInputAreaProps> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.error, className)}>{children}</div>;
};

export const SignInModuleBtnRow: React.FC<PrfsIdSignInModuleInputAreaProps> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.btnRow, className)}>{children}</div>;
};

export const SignInInputItem: React.FC<PrfsIdSignInModuleInputProps> = ({
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

export const SignInInputGuide: React.FC<PrfsIdSignInModuleInputAreaProps> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.inputGuide, className)}>{children}</div>;
};

export const SignInForm: React.FC<PrfsIdSignInModuleInputAreaProps> = ({ children }) => {
  return <form className={styles.form}>{children}</form>;
};

export const SignInInnerPadding: React.FC<PrfsIdSignInModuleInputAreaProps> = ({
  children,
  noSidePadding,
}) => {
  return (
    <div className={cn(styles.innerPadding, { [styles.noSidePadding]: noSidePadding })}>
      {children}
    </div>
  );
};

export const SignInWithPrfsId: React.FC<PrfsIdSignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.signInWithPrfsId}>{children}</div>;
};

export const SignInModule: React.FC<PrfsIdSignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export interface PrfsIdSignInModuleInputAreaProps {
  className?: string;
  noTopPadding?: boolean;
  noSidePadding?: boolean;
  children: React.ReactNode;
}

export interface PrfsIdSignInModuleInputProps {
  className?: string;
  name?: string;
  value: string;
  handleChangeValue: React.ChangeEventHandler;
  handleKeyDown?: React.KeyboardEventHandler;
  error: string | undefined;
  placeholder?: string;
  type?: HTMLInputTypeAttribute | undefined;
}
