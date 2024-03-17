"use client";

import React from "react";
import cn from "classnames";
import { useRouter, useSearchParams } from "next/navigation";
import { PrivateKey, createRandomKeyPair, decrypt, makeRandInt } from "@taigalabs/prfs-crypto-js";
import PrfsIdSignInButton from "@taigalabs/prfs-react-lib/src/prfs_id_sign_in_button/PrfsIdSignInButton";
import PrfsCredentialPopover from "@taigalabs/prfs-react-lib/src/prfs_credential_popover/PrfsCredentialPopover";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import { shyApi2 } from "@taigalabs/shy-api-js";
import { SignInShyAccountRequest } from "@taigalabs/shy-entities/bindings/SignInShyAccountRequest";
import { SignUpShyAccountRequest } from "@taigalabs/shy-entities/bindings/SignUpShyAccountRequest";
import {
  AppSignInData,
  makeColor,
  createSessionKey,
  ProofGenArgs,
  AppSignInType,
  QueryType,
  ProofGenSuccessPayload,
  AppSignInResult,
} from "@taigalabs/prfs-id-sdk-web";
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

const SIGN_IN = "SIGN_IN";

enum Status {
  InProgress,
  Standby,
}

const ShySignInBtn: React.FC<ShySignInBtnProps> = ({
  className,
  label,
  noCredentialPopover,
  noSignInBtn,
}) => {
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
  const [signUpData, setSignUpData] = React.useState<LocalShyCredential | null>(null);
  const [sk, proofGenArgs] = React.useMemo<[PrivateKey, ProofGenArgs]>(() => {
    const { sk, pkHex } = createRandomKeyPair();
    const session_key = createSessionKey();
    const proofGenArgs: ProofGenArgs = {
      nonce: makeRandInt(1000000),
      app_id: "shy_webapp",
      queries: [
        {
          name: SIGN_IN,
          type: AppSignInType.EC_SECP256K1,
          queryType: QueryType.APP_SIGN_IN,
          appSignInData: [AppSignInData.ID_POSEIDON],
        },
      ],
      public_key: pkHex,
      session_key,
    };

    return [sk, proofGenArgs];
  }, []);
  const searchParams = useSearchParams();

  const handleSucceedSignIn = React.useCallback(
    async (encrypted: Buffer) => {
      async function fn() {
        if (sk && encrypted.length > 0) {
          let decrypted: string;
          try {
            decrypted = decrypt(sk.secret, encrypted).toString();
          } catch (err) {
            console.error("Failed to decrypt, err: %s, msg: %s", err, encrypted);
            return;
          }

          let proofGenSuccessPayload: ProofGenSuccessPayload;
          try {
            proofGenSuccessPayload = JSON.parse(decrypted) as ProofGenSuccessPayload;
          } catch (err) {
            dispatch(
              setGlobalError({
                errorObj: err,
                message: `Cannot parse sign in payload, msg: ${decrypted}`,
              }),
            );
            return;
          }

          const signInResult: AppSignInResult = proofGenSuccessPayload.receipt[SIGN_IN];
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
                    errorObj: error,
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
                  errorObj: error,
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
    [
      router,
      dispatch,
      signInShyAccount,
      setSignUpData,
      searchParams,
      setStatus,
      router,
      signUpShyAccount,
    ],
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
          proofGenArgs={proofGenArgs}
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
