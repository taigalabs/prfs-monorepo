import React from "react";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { decrypt, PrivateKey } from "eciesjs";
import PrfsIdSignInButton from "@taigalabs/prfs-react-components/src/prfs_id_sign_in_button/PrfsIdSignInButton";
import PrfsCredentialPopover from "@taigalabs/prfs-react-components/src/prfs_credential_popover/PrfsCredentialPopover";
import {
  persistPrfsIdCredential,
  PrfsIdSignInSuccessPayload,
  SignInData,
} from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { useMutation } from "wagmi";
import { prfs_api_error_codes, prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsSignUpRequest } from "@taigalabs/prfs-entities/bindings/PrfsSignUpRequest";
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
import Modal from "@taigalabs/prfs-react-components/src/modal/Modal";
import { i18nContext } from "@/i18n/context";

const SignUpModal: React.FC<SignUpModalProps> = ({ signUpData }) => {
  const router = useRouter();
  const i18n = React.useContext(i18nContext);
  const { mutateAsync: prfsSignUpRequest } = useMutation({
    mutationFn: (req: PrfsSignUpRequest) => {
      return prfsApi2("sign_in_prfs_account", req);
    },
  });
  const handleClickSignUp = React.useCallback(async () => {
    const avatarColor = makeColor(signUpData.account_id);
    const credential: LocalPrfsProofCredential = {
      account_id: signUpData.account_id,
      public_key: signUpData.public_key,
      avatar_color: avatarColor,
    };

    const { payload, error } = await prfsSignUpRequest(credential);

    if (error) {
      console.error(error);
      return;
    }

    persistPrfsProofCredential(credential);
  }, [router, signUpData, prfsSignUpRequest]);

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
