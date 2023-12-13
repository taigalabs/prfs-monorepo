import React, { ChangeEventHandler, HTMLInputTypeAttribute } from "react";
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
  name,
  value,
  error,
  type,
  placeholder,
  handleChangeValue,
}) => {
  return (
    <div
      className={cn(styles.inputItem, {
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
}) => {
  return <div className={styles.innerPadding}>{children}</div>;
};

const PrfsIdSignInModule: React.FC<PrfsIdSignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default PrfsIdSignInModule;

export interface PrfsIdSignInModuleInputAreaProps {
  className?: string;
  noTopPadding?: boolean;
  children: React.ReactNode;
}

export interface PrfsIdSignInModuleInputProps {
  name?: string;
  value: string;
  handleChangeValue: React.ChangeEventHandler;
  error: string | undefined;
  placeholder?: string;
  type?: HTMLInputTypeAttribute | undefined;
}
