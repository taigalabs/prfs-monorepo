"use client";

import React from "react";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { encrypt, decrypt, PrivateKey } from "eciesjs";
import SignInButton from "@taigalabs/prfs-react-components/src/sign_in_button/SignInButton";
import { SignInSuccessPayload } from "@taigalabs/prfs-zauth-interface";

import styles from "./SignInBtn.module.scss";
import { paths } from "@/paths";
import { envs } from "@/envs";

const SignInBtn: React.FC<SignInBtnProps> = () => {
  const router = useRouter();
  const [prfsSignInEndpoint, setPrfsSignInEndpoint] = React.useState<string | null>(null);

  React.useEffect(() => {
    const sk = new PrivateKey();
    const pkHex = sk.publicKey.toHex();
    const redirect_uri = encodeURIComponent(window.location.toString());
    setPrfsSignInEndpoint(
      `${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}${paths.accounts__signin}?pk=${pkHex}&redirect_uri=${redirect_uri}`,
    );
  }, [setPrfsSignInEndpoint]);

  const handleSucceedSignIn = React.useCallback(
    async (data: SignInSuccessPayload) => {
      console.log(222, data);
    },
    [router],
  );

  return (
    <SignInButton
      prfsSignInEndpoint={prfsSignInEndpoint}
      handleSucceedSignIn={handleSucceedSignIn}
    />
  );
};

export default SignInBtn;

export interface SignInBtnProps {}
