"use client";

import React from "react";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { KeyPair, createRandomKeyPair, decrypt, makeRandInt } from "@taigalabs/prfs-crypto-js";
import PrfsIdSignInButton from "@taigalabs/prfs-react-lib/src/prfs_id_sign_in_button/PrfsIdSignInButton";
import PrfsCredentialPopover from "@taigalabs/prfs-react-lib/src/prfs_credential_popover/PrfsCredentialPopover";
import prfs_api_error_codes from "@taigalabs/prfs-api-error-codes";
import {
  AppSignInData,
  makeColor,
  createSessionKey,
  ProofGenArgs,
  AppSignInType,
  QueryType,
  AppSignInResult,
} from "@taigalabs/prfs-id-sdk-web";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { SignInPrfsAccountRequest } from "@taigalabs/prfs-entities/bindings/SignInPrfsAccountRequest";
import { setGlobalError } from "@taigalabs/prfs-react-lib/src/global_error_reducer";
import { SignUpPrfsAccountRequest } from "@taigalabs/prfs-entities/bindings/SignUpPrfsAccountRequest";

import styles from "./PrfsIdSignInBtn.module.scss";
import { envs } from "@/envs";
import { useAppDispatch } from "@/state/hooks";
import { signInPrfs, signOutPrfs } from "@/state/userReducer";
import {
  LocalPrfsProofCredential,
  persistPrfsProofCredential,
  removeLocalPrfsProofCredential,
} from "@/storage/local_storage";
import { useSignedInProofUser } from "@/hooks/user";
import { paths } from "@/paths";
import { PRFS_PROOF_APP_ID } from "@/app_id";

const SIGN_IN = "SIGN_IN";

const PrfsIdSignInBtn: React.FC<PrfsIdSignInBtnProps> = ({
  className,
  label,
  noCredential,
  appId,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isInitialized, prfsProofCredential } = useSignedInProofUser();
  const { mutateAsync: signInPrfsAccount } = useMutation({
    mutationFn: (req: SignInPrfsAccountRequest) => {
      return prfsApi3({ type: "sign_in_prfs_account", ...req });
    },
  });
  const { mutateAsync: signUpPrfsAccount } = useMutation({
    mutationFn: (req: SignUpPrfsAccountRequest) => {
      return prfsApi3({ type: "sign_up_prfs_account", ...req });
    },
  });

  const handleSucceedSignIn = React.useCallback(
    async (signInResult: AppSignInResult) => {
      if (!signInResult.account_id || !signInResult.public_key) {
        dispatch(
          setGlobalError({
            message: `Invalid sign in result, result: ${signInResult}`,
          }),
        );
        return;
      }

      const { error, code } = await signInPrfsAccount({
        account_id: signInResult.account_id,
      });
      const avatar_color = makeColor(signInResult.account_id);
      const credential: LocalPrfsProofCredential = {
        account_id: signInResult.account_id,
        public_key: signInResult.public_key,
        avatar_color,
      };

      if (error) {
        if (code === prfs_api_error_codes.CANNOT_FIND_USER.code) {
          const { error, code } = await signUpPrfsAccount({
            account_id: signInResult.account_id,
            avatar_color,
            public_key: signInResult.public_key,
          });

          if (error) {
            dispatch(
              setGlobalError({
                // errorObj: error,
                message: `Error signing up, err: ${error.toString()}`,
              }),
            );
            return;
          }

          persistPrfsProofCredential(credential);
          dispatch(signInPrfs(credential));
          router.push(paths.account__welcome);
        } else {
          dispatch(
            setGlobalError({
              // errorObj: error,
              message: `Error signing in, err: ${error.toString()}`,
            }),
          );
          return;
        }
        return;
      }

      persistPrfsProofCredential(credential);
      dispatch(signInPrfs(credential));
    },
    [router, dispatch, signInPrfsAccount, signUpPrfsAccount],
  );

  const handleClickSignOut = React.useCallback(() => {
    removeLocalPrfsProofCredential();
    dispatch(signOutPrfs());
  }, [dispatch]);

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

  return prfsProofCredential ? (
    noCredential ? (
      <div>Loading...</div>
    ) : (
      <PrfsCredentialPopover
        credential={prfsProofCredential}
        handleInitFail={handleInitFail}
        handleClickSignOut={handleClickSignOut}
      />
    )
  ) : (
    <>
      <PrfsIdSignInButton
        className={cn(styles.signInBtn, className)}
        label={label}
        appId={appId}
        isLoading={!isInitialized}
        handleSignInError={handleSignInError}
        handleSucceedSignIn={handleSucceedSignIn}
        prfsIdEndpoint={envs.NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT}
      />
    </>
  );
};

export default PrfsIdSignInBtn;

export interface PrfsIdSignInBtnProps {
  className?: string;
  label?: string;
  noCredential?: boolean;
  appId: string;
}
