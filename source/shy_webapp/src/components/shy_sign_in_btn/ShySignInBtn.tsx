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
import { makeColor, AppSignInResult } from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import shy_api_error_codes from "@taigalabs/shy-api-error-codes";
import { setGlobalError } from "@taigalabs/prfs-react-lib/src/global_error_reducer";

import styles from "./ShySignInBtn.module.scss";
import { envs } from "@/envs";
import { useAppDispatch } from "@/state/hooks";
import { signInShy, signOutShy } from "@/state/userReducer";
import {
  LocalShyCredential,
  persistShyCredential,
  removeLocalShyCredential,
} from "@/storage/local_storage";
import { useSignedInShyUser } from "@/hooks/user";
import { paths } from "@/paths";
import { SHY_APP_ID } from "@/app_id";

enum Status {
  InProgress,
  Standby,
}

const ShySignInBtn: React.FC<ShySignInBtnProps> = ({ noCredentialPopover, noSignInBtn }) => {
  const i18n = usePrfsI18N();
  const router = useRouter();
  const [status, setStatus] = React.useState(Status.Standby);
  const dispatch = useAppDispatch();
  const { isInitialized, shyCredential } = useSignedInShyUser();
  const { mutateAsync: signInShyAccount } = useMutation({
    mutationFn: (req: SignInShyAccountRequest) => {
      return shyApi2({ type: "sign_in_shy_account", ...req });
    },
  });
  const { mutateAsync: signUpShyAccount } = useMutation({
    mutationFn: (req: SignUpShyAccountRequest) => {
      return shyApi2({ type: "sign_up_shy_account", ...req });
    },
  });
  const searchParams = useSearchParams();

  const handleSucceedSignIn = React.useCallback(
    async (signInResult: AppSignInResult) => {
      async function fn() {
        if (signInResult) {
          const avatar_color = makeColor(signInResult.account_id);

          const { error, code } = await signInShyAccount({
            account_id: signInResult.account_id,
          });

          if (error) {
            if (code === shy_api_error_codes.CANNOT_FIND_USER.code) {
              const { error } = await signUpShyAccount({
                account_id: signInResult.account_id,
                public_key: signInResult.public_key,
                avatar_color,
              });

              if (error) {
                dispatch(
                  setGlobalError({
                    // errorObj: error,
                    message: "Failed to sign up",
                  }),
                );
                return;
              }

              const credential: LocalShyCredential = {
                account_id: signInResult.account_id,
                public_key: signInResult.public_key,
                avatar_color,
              };

              persistShyCredential(credential);
              dispatch(signInShy(credential));
              router.push(paths.account__welcome);
            } else {
              dispatch(
                setGlobalError({
                  // errorObj: error,
                  message: "Failed to sign up",
                }),
              );
              return;
            }
          } else {
            const credential: LocalShyCredential = {
              account_id: signInResult.account_id,
              public_key: signInResult.public_key,
              avatar_color,
            };

            persistShyCredential(credential);
            dispatch(signInShy(credential));
            router.push(paths.__);
          }
        }
      }
      setStatus(Status.InProgress);
      fn().then();
      setStatus(Status.Standby);
    },
    [router, dispatch, signInShyAccount, searchParams, setStatus, router, signUpShyAccount],
  );

  const handleClickSignOut = React.useCallback(() => {
    removeLocalShyCredential();
    dispatch(signOutShy());
    router.push(paths.__);
  }, [dispatch, router]);

  const handleInitFail = React.useCallback(() => {
    console.log("Failed init Prfs Proof credential!");
  }, []);

  const handleSignInError = React.useCallback(
    (err: string) => {
      dispatch(
        setGlobalError({
          message: err,
        }),
      );
    },
    [dispatch],
  );

  if (!isInitialized) {
    return <Spinner size={18} color="#5c5c5c" borderWidth={1} />;
  }

  return shyCredential ? (
    !noCredentialPopover && (
      <PrfsCredentialPopover
        credential={shyCredential}
        handleInitFail={handleInitFail}
        handleClickSignOut={handleClickSignOut}
      />
    )
  ) : (
    <>
      {!noSignInBtn && (
        <PrfsIdSignInButton
          className={styles.signInBtn}
          label={i18n.sign_in_with_prfs_id}
          appId={SHY_APP_ID}
          handleSignInError={handleSignInError}
          handleSucceedSignIn={handleSucceedSignIn}
          prfsIdEndpoint={envs.NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT}
          isLoading={status === Status.InProgress}
        />
      )}
    </>
  );
};

export default ShySignInBtn;

export interface ShySignInBtnProps {
  className?: string;
  label?: string;
  noCredentialPopover?: boolean;
  noSignInBtn?: boolean;
}
