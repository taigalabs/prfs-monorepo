"use client";

import React from "react";
import cn from "classnames";
import { useRouter, useSearchParams } from "next/navigation";
import { PrivateKey, createRandomKeyPair, decrypt, makeRandInt } from "@taigalabs/prfs-crypto-js";
import PrfsIdSignInButton from "@taigalabs/prfs-react-lib/src/prfs_id_sign_in_button/PrfsIdSignInButton";
import PrfsCredentialPopover from "@taigalabs/prfs-react-lib/src/prfs_credential_popover/PrfsCredentialPopover";
import {
  SignInSuccessPayload,
  AppSignInData,
  makeColor,
  AppSignInArgs,
  createSessionKey,
} from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { prfs_api_error_codes, prfsApi3 } from "@taigalabs/prfs-api-js";
import { PrfsSignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsSignInRequest";

import styles from "./ShySignInBtn.module.scss";
import { envs } from "@/envs";
import { useAppDispatch } from "@/state/hooks";
import { signInShy, signOutShy } from "@/state/userReducer";
import {
  LocalShyCredential,
  persistShyCredential,
  removeLocalShyCredential,
} from "@/storage/local_storage";
import SignUpModal from "@/components/sign_up_modal/SignUpModal";
import { useSignedInShyUser } from "@/hooks/user";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";

const ShySignInBtn: React.FC<ShySignInBtnProps> = ({
  className,
  label,
  noCredentialPopover,
  noSignInBtn,
}) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isInitialized, shyCredential } = useSignedInShyUser();
  const { mutateAsync: prfsSignInRequest } = useMutation({
    mutationFn: (req: PrfsSignInRequest) => {
      return prfsApi3({ type: "sign_in_prfs_account", ...req });
    },
  });
  const [signUpData, setSignUpData] = React.useState<LocalShyCredential | null>(null);
  const { sk, appSignInArgs } = React.useMemo<{
    sk: PrivateKey;
    appSignInArgs: AppSignInArgs;
  }>(() => {
    const { sk, pkHex } = createRandomKeyPair();
    const session_key = createSessionKey();
    const appSignInArgs = {
      nonce: makeRandInt(1000000),
      app_id: "shy_webapp",
      sign_in_data: [AppSignInData.ID_POSEIDON],
      public_key: pkHex,
      session_key,
    };

    return { sk, appSignInArgs };
  }, []);
  const searchParams = useSearchParams();

  const handleSucceedSignIn = React.useCallback(
    async (encrypted: Buffer) => {
      if (sk && encrypted.length > 0) {
        let decrypted: string;
        try {
          decrypted = decrypt(sk.secret, encrypted).toString();
        } catch (err) {
          console.error(err);
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
        const credential: LocalShyCredential = {
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

        persistShyCredential(credential);
        dispatch(signInShy(credential));
      }
    },
    [router, dispatch, prfsSignInRequest, setSignUpData, searchParams],
  );

  const handleClickSignOut = React.useCallback(() => {
    removeLocalShyCredential();
    dispatch(signOutShy());
    router.push(paths.__);
  }, [dispatch, router]);

  const handleInitFail = React.useCallback(() => {
    console.log("Failed init Prfs Proof credential!");
  }, []);

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
      {signUpData && <SignUpModal credential={signUpData} />}
      {!noSignInBtn && (
        <PrfsIdSignInButton
          className={styles.signInBtn}
          label={i18n.sign_in_up_with_prfs_id}
          appSignInArgs={appSignInArgs}
          handleSucceedSignIn={handleSucceedSignIn}
          prfsIdEndpoint={envs.NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT}
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
