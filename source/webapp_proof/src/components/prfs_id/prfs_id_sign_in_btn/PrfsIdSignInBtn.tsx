"use client";

import React from "react";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { decrypt } from "eciesjs";
import PrfsIdSignInButton from "@taigalabs/prfs-react-components/src/prfs_id_sign_in_button/PrfsIdSignInButton";
import PrfsCredentialPopover from "@taigalabs/prfs-react-components/src/prfs_credential_popover/PrfsCredentialPopover";
import { PrfsIdSignInSuccessPayload, AppSignInData } from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { useMutation } from "@tanstack/react-query";
import { prfs_api_error_codes, prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsSignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsSignInRequest";
import { makeColor } from "@taigalabs/prfs-crypto-js";

import styles from "./PrfsIdSignInBtn.module.scss";
import { paths } from "@/paths";
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
import { useRandomKeyPair } from "@/hooks/key";

const PrfsIdSignInBtn: React.FC<PrfsIdSignInBtnProps> = ({ className, label, noCredential }) => {
  const router = useRouter();
  const [prfsIdSignInEndpoint, setPrfsIdSignInEndpoint] = React.useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { isCredentialInitialized, prfsProofCredential } = useSignedInUser();
  const { mutateAsync: prfsSignInRequest } = useMutation({
    mutationFn: (req: PrfsSignInRequest) => {
      return prfsApi2("sign_in_prfs_account", req);
    },
  });
  const [signUpData, setSignUpData] = React.useState<LocalPrfsProofCredential | null>(null);
  const { sk, pkHex } = useRandomKeyPair();

  React.useEffect(() => {
    const nonce = Math.random() * 1000000;
    const appId = "prfs_proof";
    const signInData = encodeURIComponent([AppSignInData.ID_POSEIDON].join(","));
    const queryString = `?public_key=${pkHex}&sign_in_data=${signInData}&app_id=${appId}&nonce=${nonce}`;
    const prfsIdEndpoint = `${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}${paths.id__app_signin}${queryString}`;
    setPrfsIdSignInEndpoint(prfsIdEndpoint);

    console.log("initializing ephemeral secret key", sk);
  }, [setPrfsIdSignInEndpoint, sk, pkHex]);

  const handleSucceedSignIn = React.useCallback(
    async (encrypted: Buffer) => {
      if (sk) {
        let decrypted: string;
        try {
          decrypted = decrypt(sk.secret, encrypted).toString();
        } catch (err) {
          console.error(err);
          return;
        }

        let prfsIdSignInSuccessPayload: PrfsIdSignInSuccessPayload;
        try {
          prfsIdSignInSuccessPayload = JSON.parse(decrypted) as PrfsIdSignInSuccessPayload;
        } catch (err) {
          console.error(err);
          return;
        }

        const { payload, error, code } = await prfsSignInRequest({
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
    [router, dispatch, prfsSignInRequest, setSignUpData],
  );

  const handleClickSignOut = React.useCallback(() => {
    removeLocalPrfsProofCredential();
    dispatch(signOutPrfs());
  }, [dispatch]);

  const handleInitFail = React.useCallback(() => {
    console.log("Failed init Prfs Proof credential!");
  }, []);

  if (!isCredentialInitialized) {
    return <Spinner size={24} color="#5c5c5c" />;
  }

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
        className={className}
        label={label}
        prfsIdSignInEndpoint={prfsIdSignInEndpoint}
        handleSucceedSignIn={handleSucceedSignIn}
      />
    </>
  );
};

export default PrfsIdSignInBtn;

export interface PrfsIdSignInBtnProps {
  className?: string;
  label?: string;
  noCredential?: boolean;
}
