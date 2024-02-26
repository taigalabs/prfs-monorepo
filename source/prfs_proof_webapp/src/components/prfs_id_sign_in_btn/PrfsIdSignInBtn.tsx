"use client";

import React from "react";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { KeyPair, createRandomKeyPair, decrypt, makeRandInt } from "@taigalabs/prfs-crypto-js";
import PrfsIdSignInButton from "@taigalabs/prfs-react-lib/src/prfs_id_sign_in_button/PrfsIdSignInButton";
import PrfsCredentialPopover from "@taigalabs/prfs-react-lib/src/prfs_credential_popover/PrfsCredentialPopover";
import {
  SignInSuccessPayload,
  AppSignInData,
  makeColor,
  AppSignInArgs,
  createSessionKey,
} from "@taigalabs/prfs-id-sdk-web";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { prfsApi3, prfs_api_error_codes } from "@taigalabs/prfs-api-js";
import { PrfsSignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsSignInRequest";

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
    mutationFn: (req: PrfsSignInRequest) => {
      return prfsApi3({ type: "sign_in_prfs_account", ...req });
    },
  });
  const [signUpData, setSignUpData] = React.useState<LocalPrfsProofCredential | null>(null);
  const [appSignInArgs, keyPair] = React.useMemo<[AppSignInArgs, KeyPair]>(() => {
    const { sk, pkHex } = createRandomKeyPair();
    const session_key = createSessionKey();
    const appSignInArgs = {
      nonce: makeRandInt(1000000),
      app_id: appId,
      sign_in_data: [AppSignInData.ID_POSEIDON],
      public_key: pkHex,
      session_key,
    };

    return [appSignInArgs, { sk, pkHex }];
  }, [appId]);

  const handleSucceedSignIn = React.useCallback(
    async (encrypted: Buffer) => {
      if (appSignInArgs) {
        if (encrypted.length === 0) {
          console.error("encrypted buffer is empty, session_key: %s", appSignInArgs.session_key);
          return;
        }

        let decrypted: string;
        try {
          decrypted = decrypt(keyPair.sk.secret, encrypted).toString();
          throw new Error("power");
        } catch (err: any) {
          console.error(err);
          dispatch(reportError(err.toString()));
          return;
        }

        let prfsIdSignInSuccessPayload: SignInSuccessPayload;
        try {
          prfsIdSignInSuccessPayload = JSON.parse(decrypted) as SignInSuccessPayload;
        } catch (err) {
          console.error(err);
          return;
        }

        const { error, code } = await prfsSignInRequest({
          account_id: prfsIdSignInSuccessPayload.account_id,
        });
        const avatar_color = makeColor(prfsIdSignInSuccessPayload.account_id);
        const credential: LocalPrfsProofCredential = {
          account_id: prfsIdSignInSuccessPayload.account_id,
          public_key: prfsIdSignInSuccessPayload.public_key,
          avatar_color,
        };

        if (error) {
          console.error(error);
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
    [router, dispatch, prfsSignInRequest, setSignUpData, appSignInArgs, keyPair],
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
        appSignInArgs={appSignInArgs}
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
