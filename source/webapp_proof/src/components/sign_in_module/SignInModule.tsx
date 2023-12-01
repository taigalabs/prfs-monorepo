import React, { ChangeEventHandler, HTMLInputTypeAttribute } from "react";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";

import styles from "./SignInModule.module.scss";

export const SignInModuleLogoArea: React.FC = () => {
  return (
    <div className={styles.logoArea}>
      <ImageLogo width={46} />
    </div>
  );
};

export const SignInModuleHeader: React.FC<SignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.header}>{children}</div>;
};

export const SignInModuleTitle: React.FC<SignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.title}>{children}</div>;
};

export const SignInModuleSubtitle: React.FC<SignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.subtitle}>{children}</div>;
};

export const SignInModuleInputArea: React.FC<SignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.inputArea}>{children}</div>;
};

export const SignInModuleBtnRow: React.FC<SignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.btnRow}>{children}</div>;
};

export const SignInInputItem: React.FC<SignInModuleInputProps> = ({
  name,
  type,
  placeholder,
  handleChangeValue,
}) => {
  return (
    <div className={styles.inputItem}>
      <input
        name={name}
        className={styles.input}
        placeholder={placeholder}
        type={type}
        onChange={handleChangeValue}
      />
    </div>
  );
};

export const SignInInputGuide: React.FC<SignInModuleInputAreaProps> = ({ children }) => {
  return <button className={styles.inputGuide}>{children}</button>;
};

// export const SignInInput: React.FC<SignInModuleInputProps> = ({ placeholder }) => {
//   return <input className={styles.input} placeholder={placeholder} />;
// };

const SignInModule: React.FC<SignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default SignInModule;

export interface SignInModuleInputAreaProps {
  children: React.ReactNode;
}

export interface SignInModuleInputProps {
  name?: string;
  handleChangeValue: React.ChangeEventHandler;
  error: string | undefined;
  placeholder?: string;
  type?: HTMLInputTypeAttribute | undefined;
}
