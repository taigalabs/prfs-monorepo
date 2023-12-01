import React from "react";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";

import styles from "./SignInModule.module.scss";

export const SignInModuleLogoArea: React.FC = () => {
  return (
    <div className={styles.logoArea}>
      <ImageLogo width={50} />
    </div>
  );
};

export const SignInModuleInputArea: React.FC<SignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.inputArea}>{children}</div>;
};

export const SignInModuleBtnRow: React.FC<SignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.btnRow}>{children}</div>;
};

const SignInModule: React.FC<SignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default SignInModule;

export interface SignInModuleInputAreaProps {
  children: React.ReactNode;
}
