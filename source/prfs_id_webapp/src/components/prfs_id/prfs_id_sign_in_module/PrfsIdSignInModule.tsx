import React, { HTMLInputTypeAttribute } from "react";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";
import cn from "classnames";

import styles from "./PrfsIdSignInModule.module.scss";

export const PrfsIdSignInModuleLogoArea: React.FC = () => {
  return (
    <div className={styles.logoArea}>
      <ImageLogo width={46} />
      <span>ID</span>
    </div>
  );
};

export const PrfsIdSignInModuleHeader: React.FC<PrfsIdSignInModuleInputAreaProps> = ({
  children,
  noTopPadding,
}) => {
  return (
    <div className={cn(styles.header, { [styles.noTopPadding]: noTopPadding })}>{children}</div>
  );
};

export const PrfsIdSignInModuleTitle: React.FC<PrfsIdSignInModuleInputAreaProps> = ({
  children,
}) => {
  return <div className={styles.title}>{children}</div>;
};

export const PrfsIdSignInModuleSubtitle: React.FC<PrfsIdSignInModuleInputAreaProps> = ({
  children,
}) => {
  return <div className={styles.subtitle}>{children}</div>;
};

export const PrfsIdSignInModuleInputArea: React.FC<PrfsIdSignInModuleInputAreaProps> = ({
  children,
}) => {
  return <div className={styles.inputArea}>{children}</div>;
};

export const PrfsIdSignInModuleFooter: React.FC<PrfsIdSignInModuleInputAreaProps> = ({
  children,
}) => {
  return <div className={styles.footer}>{children}</div>;
};

export const PrfsIdSignInErrorMsg: React.FC<PrfsIdSignInModuleInputAreaProps> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.error, className)}>{children}</div>;
};

export const PrfsIdSignInModuleBtnRow: React.FC<PrfsIdSignInModuleInputAreaProps> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.btnRow, className)}>{children}</div>;
};

export const PrfsIdSignInInputItem: React.FC<PrfsIdSignInModuleInputProps> = ({
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

export const PrfsIdSignInInputGuide: React.FC<PrfsIdSignInModuleInputAreaProps> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.inputGuide, className)}>{children}</div>;
};

export const PrfsIdSignInForm: React.FC<PrfsIdSignInModuleInputAreaProps> = ({ children }) => {
  return <form className={styles.form}>{children}</form>;
};

export const PrfsIdSignInInnerPadding: React.FC<PrfsIdSignInModuleInputAreaProps> = ({
  children,
  noSidePadding,
}) => {
  return (
    <div className={cn(styles.innerPadding, { [styles.noSidePadding]: noSidePadding })}>
      {children}
    </div>
  );
};

export const PrfsIdSignInWithPrfsId: React.FC<PrfsIdSignInModuleInputAreaProps> = ({
  children,
}) => {
  return <div className={styles.signInWithPrfsId}>{children}</div>;
};

const PrfsIdSignInModule: React.FC<PrfsIdSignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default PrfsIdSignInModule;

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
