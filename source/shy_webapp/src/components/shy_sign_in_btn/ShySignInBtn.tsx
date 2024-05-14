"use client";

import React from "react";
import cn from "classnames";
import { useRouter, useSearchParams } from "next/navigation";
import PrfsIdSignInButton from "@taigalabs/prfs-react-lib/src/prfs_id_sign_in_button/PrfsIdSignInButton";
import PrfsCredentialPopover from "@taigalabs/prfs-react-lib/src/prfs_credential_popover/PrfsCredentialPopover";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { shyApi2 } from "@taigalabs/shy-api-js";
import { SignInShyAccountRequest } from "@taigalabs/shy-entities/bindings/SignInShyAccountRequest";
import { SignUpShyAccountRequest } from "@taigalabs/shy-entities/bindings/SignUpShyAccountRequest";
import { makeIdentityColor, AppSignInResult } from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import shy_api_error_codes from "@taigalabs/shy-api-error-codes";
import { MdPerson } from "@react-icons/all-files/md/MdPerson";

import styles from "./ShySignInBtn.module.scss";
import { envs } from "@/envs";
import { useAppDispatch } from "@/state/hooks";
import { signInShy, signOutShy } from "@/state/userReducer";
import {
  LocalShyCredential,
  persistShyCredential,
  removeLocalShyCredential,
} from "@/storage/shy_credential";
import { useSignedInShyUser } from "@/hooks/user";
import { paths } from "@/paths";
import { SHY_APP_ID } from "@/app_id";
import { setGlobalMsg } from "@/state/globalMsgReducer";
import { removeLocalShyCache } from "@/storage/shy_cache";
import ShySignInDialog from "./ShySignInDialog";
// import SignInViaPrfs from "./SignInViaPrfs";

enum Status {
  InProgress,
  Standby,
}

const ShySignInBtn: React.FC<ShySignInBtnProps> = ({ noCredentialPopover, noSignInBtn }) => {
  const i18n = usePrfsI18N();
  const router = useRouter();
  const [status, setStatus] = React.useState(Status.Standby);
  const dispatch = useAppDispatch();
  const { isCredentialInitialized, shyCredential } = useSignedInShyUser();

  const searchParams = useSearchParams();

  const handleSucceedSignIn = React.useCallback(
    async (signInResult: AppSignInResult) => {
      if (signInResult) {
        setStatus(Status.InProgress);
        const avatar_color = makeIdentityColor(signInResult.account_id);

        const credential: LocalShyCredential = {
          account_id: signInResult.account_id,
          public_key: signInResult.public_key,
          avatar_color,
        };
        persistShyCredential(credential);
        dispatch(signInShy(credential));
        setStatus(Status.Standby);
      }
    },
    [router, dispatch, searchParams, setStatus, router],
  );

  const handleClickSignOut = React.useCallback(() => {
    removeLocalShyCredential();
    removeLocalShyCache();
    dispatch(signOutShy());
    router.push(paths.__);
  }, [dispatch, router]);

  const handleInitFail = React.useCallback(() => {
    console.log("Failed init Prfs Proof credential!");
  }, []);

  const handleSignInError = React.useCallback(
    (err: string) => {
      dispatch(
        setGlobalMsg({
          variant: "error",
          message: err,
        }),
      );
    },
    [dispatch],
  );

  if (!isCredentialInitialized) {
    return <Spinner size={18} color="#5c5c5c" borderWidth={1} />;
  }

  return shyCredential ? (
    <PrfsCredentialPopover
      credential={shyCredential}
      handleInitFail={handleInitFail}
      handleClickSignOut={handleClickSignOut}
    />
  ) : (
    <ShySignInDialog
      className={styles.signInBtn}
      label={i18n.load_id}
      appId={SHY_APP_ID}
      handleSignInError={handleSignInError}
      handleSucceedSignIn={handleSucceedSignIn}
      prfsIdEndpoint={envs.NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT}
    />
  );
};

export default ShySignInBtn;

export interface ShySignInBtnProps {
  className?: string;
  label?: string;
  noCredentialPopover?: boolean;
  noSignInBtn?: boolean;
}
