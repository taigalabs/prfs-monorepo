"use client";

import React from "react";

import styles from "./CreateID.module.scss";
import { i18nContext } from "@/contexts/i18n";
import SignInModule, {
  SignInInput,
  SignInInputItem,
  SignInModuleBtnRow,
  SignInModuleHeader,
  SignInModuleInputArea,
  SignInModuleLogoArea,
  SignInModuleSubtitle,
  SignInModuleTitle,
} from "@/components/sign_in_module/SignInModule";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import { paths } from "@/paths";

const CreateID: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  const handleClickNext = React.useCallback(() => {}, []);

  return (
    <div className={styles.wrapper}>
      <SignInModule>
        <SignInModuleLogoArea />
        <SignInModuleHeader>
          <SignInModuleTitle>{i18n.create_zauth_identity}</SignInModuleTitle>
        </SignInModuleHeader>
        <SignInModuleInputArea>
          <div>
            <SignInInputItem placeholder="power" />
            <SignInInputItem placeholder="power" />
          </div>
          <div>
            <SignInInputItem placeholder="power" />
            <SignInInputItem placeholder="power" />
          </div>
          <div>
            <SignInInputItem placeholder="power" />
            <SignInInputItem placeholder="power" />
          </div>
        </SignInModuleInputArea>
        <SignInModuleBtnRow>
          <Link href={paths.id}>
            <Button variant="transparent_blue_2" noTransition>
              {i18n.already_have_id}
            </Button>
          </Link>
          <Button
            variant="blue_2"
            className={styles.signInBtn}
            noTransition
            handleClick={handleClickNext}
            noShadow
          >
            {i18n.sign_in}
          </Button>
        </SignInModuleBtnRow>
      </SignInModule>
    </div>
  );
};

export default CreateID;
