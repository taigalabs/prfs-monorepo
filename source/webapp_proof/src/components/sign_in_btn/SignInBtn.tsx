"use client";

import React from "react";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { encrypt, decrypt, PublicKey, PrivateKey } from "eciesjs";
import SignInButton from "@taigalabs/prfs-react-components/src/sign_in_button/SignInButton";
import { SignInSuccessPayload } from "@taigalabs/prfs-id-sdk-web";

import styles from "./SignInBtn.module.scss";
import { paths } from "@/paths";
import { envs } from "@/envs";
import { useAppDispatch } from "@/state/hooks";
import { signInPrfs } from "@/state/userReducer";

const SignInBtn: React.FC<SignInBtnProps> = () => {
  const router = useRouter();
  const [prfsSignInEndpoint, setPrfsSignInEndpoint] = React.useState<string | null>(null);
  const secretKeyRef = React.useRef<PrivateKey | null>(null);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (!secretKeyRef.current) {
      const sk = new PrivateKey();
      const pkHex = sk.publicKey.toHex();
      const redirect_uri = encodeURIComponent(window.location.toString());
      setPrfsSignInEndpoint(
        `${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}${paths.id__signin}?public_key=${pkHex}&redirect_uri=${redirect_uri}`,
      );

      console.log("initializing ephemeral secret key", sk);
      secretKeyRef.current = sk;
    }
  }, [setPrfsSignInEndpoint]);

  const handleSucceedSignIn = React.useCallback(
    async (encrypted: Buffer) => {
      if (secretKeyRef.current) {
        const sk = secretKeyRef.current;
        const decrypted = decrypt(sk.secret, Buffer.from(encrypted)).toString();
        const msg = JSON.parse(decrypted) as SignInSuccessPayload;

        dispatch(signInPrfs);
        console.log(123, msg);
      }
    },
    [router, dispatch],
  );

  return (
    <SignInButton
      prfsSignInEndpoint={prfsSignInEndpoint}
      handleSucceedSignIn={handleSucceedSignIn}
    />
  );
};

export default SignInBtn;

export interface SignInBtnProps { }
