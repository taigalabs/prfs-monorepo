"use client";

import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { idApi } from "@taigalabs/prfs-api-js";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { useRouter } from "next/navigation";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import cn from "classnames";
import { IoMdEye } from "@react-icons/all-files/io/IoMdEye";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import copy from "copy-to-clipboard";
import { PrfsIdCredential, makeColor } from "@taigalabs/prfs-crypto-js";
import Tooltip from "@taigalabs/prfs-react-components/src/tooltip/Tooltip";
import { IdCreateForm } from "@/functions/validate_id";
import Link from "next/link";
import { useMutation } from "wagmi";
import { PrfsIdentitySignUpRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignUpRequest";

import styles from "./Step2.module.scss";
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
          <div>123</div>
          <PrfsIdSignInModuleBtnRow className={styles.btnRow}>
            <div />
            <Button
              type="button"
              variant="transparent_blue_2"
              noTransition
              handleClick={handleClickSignIn}
              noShadow
            >
              {i18n.already_have_id}
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
