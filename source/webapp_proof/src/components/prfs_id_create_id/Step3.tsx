"use client";

import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { idApi } from "@taigalabs/prfs-api-js";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { useRouter } from "next/navigation";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import { PrfsIdCredential } from "@taigalabs/prfs-crypto-js";
import { TbCertificate } from "@taigalabs/prfs-react-components/src/tabler_icons/TbCertificate";

import styles from "./Step3.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  PrfsIdSignInErrorMsg,
  PrfsIdSignInInnerPadding,
  PrfsIdSignInInputGuide,
  PrfsIdSignInModuleBtnRow,
  PrfsIdSignInModuleHeader,
  PrfsIdSignInModuleLogoArea,
  PrfsIdSignInModuleSubtitle,
  PrfsIdSignInModuleTitle,
} from "@/components/prfs_id_sign_in_module/PrfsIdSignInModule";
import { paths } from "@/paths";

const Step3: React.FC<Step3Props> = ({ handleClickSignIn, credential }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  return (
    <PrfsIdSignInInnerPadding>
      <PrfsIdSignInModuleLogoArea />
      <div className={styles.wrapper}>
        <Fade>
          <PrfsIdSignInModuleHeader>
            <PrfsIdSignInModuleTitle>{i18n.sign_up_success}</PrfsIdSignInModuleTitle>
            <PrfsIdSignInModuleSubtitle>{i18n.sign_in_with_your_id}</PrfsIdSignInModuleSubtitle>
          </PrfsIdSignInModuleHeader>
          <div className={styles.main}>
            <div className={styles.img}>
              <TbCertificate />
            </div>
            <div className={styles.prfsId}>{credential.id}</div>
          </div>
          <PrfsIdSignInModuleBtnRow className={styles.btnRow}>
            <div />
            <Button
              type="button"
              variant="blue_2"
              noTransition
              handleClick={handleClickSignIn}
              noShadow
            >
              {i18n.sign_in}
            </Button>
          </PrfsIdSignInModuleBtnRow>
        </Fade>
      </div>
    </PrfsIdSignInInnerPadding>
  );
};

export default Step3;

export interface Step3Props {
  handleClickSignIn: () => void;
  credential: PrfsIdCredential;
}
