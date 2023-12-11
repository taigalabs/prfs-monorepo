"use client";

import React from "react";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { encrypt, decrypt, PublicKey, PrivateKey } from "eciesjs";
import PrfsIdSignInButton from "@taigalabs/prfs-react-components/src/prfs_id_sign_in_button/PrfsIdSignInButton";
import { SignInSuccessPayload, SignInData } from "@taigalabs/prfs-id-sdk-web";

import styles from "./PrfsSignInBtn.module.scss";
import { paths } from "@/paths";
import { envs } from "@/envs";
import { useAppDispatch } from "@/state/hooks";
import { signInPrfs } from "@/state/userReducer";

const PrfsSignInBtn: React.FC<PrfsSignInBtnProps> = () => {
  const router = useRouter();
  const [prfsIdSignInEndpoint, setPrfsIdSignInEndpoint] = React.useState<string | null>(null);
  const secretKeyRef = React.useRef<PrivateKey | null>(null);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (!secretKeyRef.current) {
      const sk = new PrivateKey();
      const pkHex = sk.publicKey.toHex();
      const redirectUri = encodeURIComponent(window.location.toString());
      const signInData = encodeURIComponent([SignInData.ID_POSEIDON].join(","));
      const queryString = `?public_key=${pkHex}&redirect_uri=${redirectUri}&sign_in_data=${signInData}`;

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
        const decrypted = decrypt(sk.secret, Buffer.from(encrypted)).toString();
        const msg = JSON.parse(decrypted) as SignInSuccessPayload;

        dispatch(signInPrfs);
        console.log(123, msg);
      }
    },
    [router, dispatch],
  );

  return (
    <PrfsIdSignInButton
      prfsIdSignInEndpoint={prfsIdSignInEndpoint}
      handleSucceedSignIn={handleSucceedSignIn}
    />
  );
};

export default PrfsSignInBtn;

export interface PrfsSignInBtnProps {}
