"use client";

import React from "react";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { decrypt, PrivateKey } from "eciesjs";
import PrfsIdSignInButton from "@taigalabs/prfs-react-components/src/prfs_id_sign_in_button/PrfsIdSignInButton";
import PrfsCredentialPopover from "@taigalabs/prfs-react-components/src/prfs_credential_popover/PrfsCredentialPopover";
import { PrfsIdSignInSuccessPayload, SignInData } from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { useMutation } from "wagmi";
import { prfs_api_error_codes, prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsSignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsSignInRequest";
import { makeColor } from "@taigalabs/prfs-crypto-js";

import styles from "./PrfsIdSignInBtn.module.scss";
import { paths } from "@/paths";
import { envs } from "@/envs";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { signInPrfs, signOutPrfs } from "@/state/userReducer";
import {
  loadLocalPrfsProofCredential,
  LocalPrfsProofCredential,
  persistPrfsProofCredential,
  removeLocalPrfsProofCredential,
} from "@/storage/local_storage";
import SignUpModal from "@/components/sign_up_modal/SignUpModal";
import { useSignedInUser } from "@/hooks/user";

const PrfsIdSignInBtn: React.FC<PrfsIdSignInBtnProps> = () => {
  const router = useRouter();
  const [prfsIdSignInEndpoint, setPrfsIdSignInEndpoint] = React.useState<string | null>(null);
  const secretKeyRef = React.useRef<PrivateKey | null>(null);
  const dispatch = useAppDispatch();
  const { isCredentialInitialized, prfsProofCredential } = useSignedInUser();
  // const prfsProofCredential = useAppSelector(state => state.user.prfsProofCredential);
  const { mutateAsync: prfsSignInRequest } = useMutation({
    mutationFn: (req: PrfsSignInRequest) => {
      return prfsApi2("sign_in_prfs_account", req);
    },
  });
  const [signUpData, setSignUpData] = React.useState<LocalPrfsProofCredential | null>(null);

  React.useEffect(() => {
    if (!secretKeyRef.current) {
      const nonce = Math.random() * 1000000;
      const sk = new PrivateKey();
      const pkHex = sk.publicKey.toHex();
      const appId = "prfs_proof";
      const redirectUri = encodeURIComponent(window.location.toString());
      const signInData = encodeURIComponent([SignInData.ID_POSEIDON].join(","));
      const queryString = `?public_key=${pkHex}&redirect_uri=${redirectUri}&sign_in_data=${signInData}&app_id=${appId}&nonce=${nonce}`;
      setPrfsIdSignInEndpoint(
        `${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}${paths.id__signin}${queryString}`,
      );
      console.log("initializing ephemeral secret key", sk);
      secretKeyRef.current = sk;
    }
  }, [setPrfsIdSignInEndpoint]);

  const handleSucceedSignIn = React.useCallback(
    async (encrypted: Buffer) => {
      if (secretKeyRef.current) {
        const sk = secretKeyRef.current;

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

        console.log(33, credential, error);

        if (error) {
          console.error(error);
          if (code === prfs_api_error_codes.CANNOT_FIND_USER.code) {
            setSignUpData(credential);
          }
          return;
        }

        console.log(44, credential);

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
    <PrfsCredentialPopover
      credential={prfsProofCredential}
      handleInitFail={handleInitFail}
      handleClickSignOut={handleClickSignOut}
    />
  ) : (
    <>
      {signUpData && <SignUpModal credential={signUpData} />}
      <PrfsIdSignInButton
        prfsIdSignInEndpoint={prfsIdSignInEndpoint}
        handleSucceedSignIn={handleSucceedSignIn}
      />
    </>
  );
};

export default PrfsIdSignInBtn;

export interface PrfsIdSignInBtnProps {}
