import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import { PrfsIdCredential } from "@taigalabs/prfs-crypto-js";
import { TbCertificate } from "@taigalabs/prfs-react-components/src/tabler_icons/TbCertificate";

import styles from "./Step3.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  PrfsIdSignInInnerPadding,
  PrfsIdSignInModuleBtnRow,
  PrfsIdSignInModuleHeader,
  PrfsIdSignInModuleLogoArea,
  PrfsIdSignInModuleSubtitle,
  PrfsIdSignInModuleTitle,
} from "@/components/prfs_id/prfs_id_sign_in_module/PrfsIdSignInModule";

const Step3: React.FC<Step3Props> = ({ handleSucceedCreateId, credential }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <PrfsIdSignInInnerPadding>
      <PrfsIdSignInModuleLogoArea />
      <div className={styles.wrapper}>
        <Fade>
          <PrfsIdSignInModuleHeader>
            <PrfsIdSignInModuleTitle>{i18n.create_prfs_id_success}</PrfsIdSignInModuleTitle>
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
              // handleClick={handleClickSignIn}
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
  handleSucceedCreateId: (credential: PrfsIdCredential) => void;
  credential: PrfsIdCredential;
}
