import React from "react";
import { initWasm, makeCredential } from "@taigalabs/prfs-crypto-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  sendMsgToOpener,
  type PrfsIdSignInSuccessMsg,
  loadLocalPrfsIdCredentials,
  StoredCredential,
} from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { encrypt, decrypt, PrivateKey, PublicKey } from "eciesjs";
import { secp256k1 as secp } from "@noble/curves/secp256k1";

import styles from "./PrfsIdSignIn.module.scss";
import { i18nContext } from "@/contexts/i18n";
import PrfsIdSignInModule, {
  PrfsIdSignInForm,
  PrfsIdSignInModuleBtnRow,
  PrfsIdSignInModuleFooter,
  PrfsIdSignInModuleHeader,
  PrfsIdSignInModuleInputArea,
  PrfsIdSignInModuleLogoArea,
  PrfsIdSignInModuleSubtitle,
  PrfsIdSignInModuleTitle,
} from "@/components/prfs_id_sign_in_module/PrfsIdSignInModule";
import { paths } from "@/paths";
import { envs } from "@/envs";
import {
  IdCreateForm,
  makeEmptyIDCreateFormErrors,
  makeEmptyIdCreateForm,
} from "@/functions/validate_id";
import ErrorDialog from "./ErrorDialog";

export enum SignInStatus {
  Loading,
  Error,
  Standby,
}

const StoredCredentials: React.FC<StoredCredentialsProps> = ({ storedCredentials }) => {
  const i18n = React.useContext(i18nContext);
  // const router = useRouter();
  // const [signInStatus, setSignInStatus] = React.useState(SignInStatus.Loading);
  // const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  // const searchParams = useSearchParams();
  // const [formData, setFormData] = React.useState<IdCreateForm>(makeEmptyIdCreateForm());
  // const [formErrors, setFormErrors] = React.useState<IdCreateForm>(makeEmptyIDCreateFormErrors());
  // const [step, setStep] = React.useState(SignInStep.StoredCredentials);
  // const [publicKey, setPublicKey] = React.useState<string | null>(null);
  // const [appId, setAppId] = React.useState<string | null>(null);
  // const [storedCredentials, setStoredCredentials] = React.useState<StoredCredential[]>([]);

  return <div>33</div>;
};

export default StoredCredentials;

export interface StoredCredentialsProps {
  storedCredentials: StoredCredential[];
}
