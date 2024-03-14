"use client";

import React from "react";
import cn from "classnames";
import { useRouter, useSearchParams } from "next/navigation";
import { PrivateKey, createRandomKeyPair, decrypt, makeRandInt } from "@taigalabs/prfs-crypto-js";
import PrfsIdSignInButton from "@taigalabs/prfs-react-lib/src/prfs_id_sign_in_button/PrfsIdSignInButton";
import PrfsCredentialPopover from "@taigalabs/prfs-react-lib/src/prfs_credential_popover/PrfsCredentialPopover";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
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
import { paths } from "@/paths";
import { reportError } from "@/state/errorReducer";

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
  const { mutateAsync: prfsSignInRequest } = useMutation({
    mutationFn: (req: PrfsSignInRequest) => {
      return prfsApi3({ type: "sign_in_prfs_account", ...req });
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
              reportError({
                errorObj: err,
                message: `Cannot parse sign in payload, msg: ${decrypted}`,
              }),
            );
            return;
          }

          const signInResult = proofGenSuccessPayload.receipt[SIGN_IN];
          // const { error, code } = await prfsSignInRequest({
          //   account_id: signInResult.account_id,
          // });
          // const avatar_color = makeColor(signInResult.account_id);
          // const credential: LocalShyCredential = {
          //   account_id: signInResult.account_id,
          //   public_key: signInResult.public_key,
          //   avatar_color,
          // };

          // persistShyCredential(credential);
          // dispatch(signInShy(credential));

          // if (error) {
          //   console.error(error);
          //   if (code === prfs_api_error_codes.CANNOT_FIND_USER.code) {
          //     router.push("/apb");
          //     // setSignUpData(credential);
          //   }
          // }
        }
      }
      setStatus(Status.InProgress);
      fn().then();
      setStatus(Status.Standby);
    },
    [router, dispatch, prfsSignInRequest, setSignUpData, searchParams, setStatus, router],
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
      {!noSignInBtn && (
        <PrfsIdSignInButton
          className={styles.signInBtn}
          label={i18n.sign_in_up_with_prfs_id}
          proofGenArgs={proofGenArgs}
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
