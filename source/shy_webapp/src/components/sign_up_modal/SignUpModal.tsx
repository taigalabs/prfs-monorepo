import React from "react";
import cn from "classnames";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { useRouter } from "next/navigation";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { PrfsSignUpRequest } from "@taigalabs/prfs-entities/bindings/PrfsSignUpRequest";
import Modal from "@taigalabs/prfs-react-lib/src/modal/Modal";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";

import styles from "./SignUpModal.module.scss";
import { paths } from "@/paths";
import { useAppDispatch } from "@/state/hooks";
import { signInShy } from "@/state/userReducer";
import { LocalShyCredential, persistShyCredential } from "@/storage/local_storage";

const SignUpModal: React.FC<SignUpModalProps> = ({ credential }) => {
  const router = useRouter();
  const i18n = usePrfsI18N();
  const [printable, setPrintable] = React.useState({
    label: "",
    avatar_color: "",
  });
  const dispatch = useAppDispatch();
  const { mutateAsync: prfsSignUpRequest } = useMutation({
    mutationFn: (req: PrfsSignUpRequest) => {
      return prfsApi3({ type: "sign_up_prfs_account", ...req });
    },
  });
  const handleClickSignUp = React.useCallback(async () => {
    const { payload, error } = await prfsSignUpRequest(credential);

    if (error) {
      console.error(error);
      return;
    }

    persistShyCredential(credential);
    dispatch(signInShy(credential));
    router.push(paths.__);
    // window.location.reload();
  }, [router, credential, prfsSignUpRequest]);

  React.useEffect(() => {
    const label = credential.account_id.substring(2, 5);
    const { avatar_color } = credential;
    setPrintable({ label, avatar_color });
  }, [credential, setPrintable]);

  return (
    <Modal>
      <div className={styles.wrapper}>
        <p className={styles.title}>{i18n.sign_up_at_prfs}</p>
        <div className={styles.account}>
          <div className={styles.avatar}>
            <p className={styles.label} style={{ backgroundColor: printable.avatar_color }}>
              {printable.label}
            </p>
          </div>
          <div className={styles.account_id}>{credential.account_id}</div>
        </div>
        <div className={styles.btnRow}>
          <Button variant="blue_2" noTransition handleClick={handleClickSignUp} noShadow>
            {i18n.sign_up}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SignUpModal;

export interface SignUpModalProps {
  credential: LocalShyCredential;
}
