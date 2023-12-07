"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";
import PrfsAppsPopover from "@taigalabs/prfs-react-components/src/prfs_apps_popover/PrfsAppsPopover";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { useRouter } from "next/navigation";
import { encrypt, decrypt, PrivateKey } from "eciesjs";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

import styles from "./Masthead.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const SignInButton: React.FC<SignInButtonProps> = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  const handleClickSignIn = React.useCallback(() => {
    const sk = new PrivateKey();
    const pkHex = sk.publicKey.toHex();
    const redirect_uri = encodeURIComponent(window.location.toString());

    // router.push(`${paths.accounts__signin}?pk=${pkHex}&redirect_uri=${redirect_uri}`);
    const w = window.open(
      `${paths.accounts__signin}?pk=${pkHex}&redirect_uri=${redirect_uri}`,
      "_blank",
      "toolbar=0,location=0,menubar=0",
    );

    w?.onmessage;
  }, [router]);

  return (
    <Button
      variant="blue_2"
      className={styles.wrapper}
      noTransition
      handleClick={handleClickSignIn}
      noShadow
    >
      {i18n.sign_in}
    </Button>
  );
};

export default SignInButton;

export interface SignInButtonProps {}
