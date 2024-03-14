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
  ProofGenSuccessPayload,
  AppSignInResult,
} from "@taigalabs/prfs-id-sdk-web";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { SignInPrfsAccountRequest } from "@taigalabs/prfs-entities/bindings/SignInPrfsAccountRequest";

import styles from "./PrfsIdSignInBtn.module.scss";
import { envs } from "@/envs";
import { useAppDispatch } from "@/state/hooks";
import { signInPrfs, signOutPrfs } from "@/state/userReducer";
import {
  LocalPrfsProofCredential,
  persistPrfsProofCredential,
  removeLocalPrfsProofCredential,
} from "@/storage/local_storage";
import SignUpModal from "@/components/sign_up_modal/SignUpModal";
import { useSignedInUser } from "@/hooks/user";
import { reportError } from "@/state/errorReducer";

const SIGN_IN = "SIGN_IN";

const PrfsIdSignInBtn: React.FC<PrfsIdSignInBtnProps> = ({
  className,
  label,
  noCredential,
  appId,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isCredentialInitialized, prfsProofCredential } = useSignedInUser();
  const { mutateAsync: prfsSignInRequest } = useMutation({
    mutationFn: (req: SignInPrfsAccountRequest) => {
      return prfsApi3({ type: "sign_in_prfs_account", ...req });
    },
  });
  const [signUpData, setSignUpData] = React.useState<LocalPrfsProofCredential | null>(null);
  const [proofGenArgs, keyPair] = React.useMemo<[ProofGenArgs, KeyPair]>(() => {
    const { sk, pkHex } = createRandomKeyPair();
    const session_key = createSessionKey();
    const proofGenArgs: ProofGenArgs = {
      nonce: makeRandInt(1000000),
      app_id: "prfs_proof",
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

    return [proofGenArgs, { sk, pkHex }];
  }, [appId]);

  const handleSucceedSignIn = React.useCallback(
    async (encrypted: Buffer) => {
      if (proofGenArgs) {
        if (encrypted.length === 0) {
          console.error("encrypted buffer is empty, session_key: %s", proofGenArgs.session_key);
          return;
        }

        let decrypted: string;
        try {
          decrypted = decrypt(keyPair.sk.secret, encrypted).toString();
        } catch (err: any) {
          dispatch(
            reportError({
              errorObj: err,
              message: `Error decrypting sign in data, err: ${err.toString()}`,
            }),
          );
          return;
        }

        let proofGenPayload: ProofGenSuccessPayload;
        try {
          proofGenPayload = JSON.parse(decrypted) as ProofGenSuccessPayload;
        } catch (err: any) {
          dispatch(
            reportError({
              errorObj: err,
              message: `Error parsing signInSuccess payload, err: ${err.toString()}`,
            }),
          );
          return;
        }

        const signInResult_ = proofGenPayload.receipt[SIGN_IN];
        let signInResult: AppSignInResult;
        try {
          if (!signInResult_) {
            dispatch(
              reportError({
                errorObj: "",
                message: `Sign in result does not exist`,
              }),
            );
            return;
          }

          signInResult = JSON.parse(signInResult_);
        } catch (err) {
          dispatch(
            reportError({
              errorObj: err,
              message: `Err parsing sign in result, json: ${signInResult_}`,
            }),
          );
          return;
        }

        if (!signInResult.account_id || !signInResult.public_key) {
          dispatch(
            reportError({
              errorObj: "",
              message: `Invalid sign in result, result: ${signInResult}`,
            }),
          );
          return;
        }

        const { error, code } = await prfsSignInRequest({
          account_id: signInResult.account_id,
        });
        const avatar_color = makeColor(signInResult.account_id);
        const credential: LocalPrfsProofCredential = {
          account_id: signInResult.account_id,
          public_key: signInResult.public_key,
          avatar_color,
        };

        if (error) {
          dispatch(
            reportError({
              errorObj: error,
              message: `Error signing in, err: ${error.toString()}`,
            }),
          );
          if (code === prfs_api_error_codes.CANNOT_FIND_USER.code) {
            setSignUpData(credential);
          }
          return;
        }

        persistPrfsProofCredential(credential);
        // prfs account sign in
        dispatch(signInPrfs(credential));
      }
    },
    [router, dispatch, prfsSignInRequest, setSignUpData, proofGenArgs, keyPair],
  );

  const handleClickSignOut = React.useCallback(() => {
    removeLocalPrfsProofCredential();
    dispatch(signOutPrfs());
  }, [dispatch]);

  const handleInitFail = React.useCallback(() => {
    console.log("Failed init Prfs Proof credential!");
  }, []);

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
      {signUpData && <SignUpModal credential={signUpData} />}
      <PrfsIdSignInButton
        className={cn(styles.signInBtn, className)}
        label={label}
        proofGenArgs={proofGenArgs}
        isLoading={!isCredentialInitialized}
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
