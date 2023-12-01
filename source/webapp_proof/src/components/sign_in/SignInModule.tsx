"use client";

import React from "react";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

import styles from "./SignInModule.module.scss";
import { i18nContext } from "@/contexts/i18n";

const SignInModule: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  const handleClickNext = React.useCallback(() => {}, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoArea}>
        <ImageLogo width={50} />
      </div>
      <div className={styles.inputs}></div>
      <div className={styles.btnRow}>
        <button>po123</button>
        <Button
          variant="blue_2"
          className={styles.signInBtn}
          noTransition
          handleClick={handleClickNext}
        >
          {i18n.sign_in}
        </Button>
      </div>
    </div>
  );
};

export default SignInModule;
