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
import { PrfsSignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsSignInRequest";
import Modal from "@taigalabs/prfs-react-components/src/modal/Modal";
import { i18nContext } from "@/i18n/context";

const SignUpModal: React.FC<SignUpModalProps> = ({ signUpData }) => {
  const router = useRouter();
  const i18n = React.useContext(i18nContext);

  const handleClickSignUp = React.useCallback(async () => {}, [router, signUpData, signUpData]);

  return (
    <Modal>
      <h2>Delete balloon</h2>
      <p>This action cannot be undone.</p>
      <button onClick={handleClickSignUp}>{i18n.sign_up}</button>
    </Modal>
  );
};

export default SignUpModal;

export interface SignUpModalProps {
  signUpData: PrfsIdSignInSuccessPayload;
}
