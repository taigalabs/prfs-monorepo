import React from "react";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import Link from "next/link";
import ActiveLink from "@taigalabs/prfs-react-components/src/active_link/ActiveLink";
import { ethers } from "ethers";
import { PrfsSDK } from "@taigalabs/prfs-sdk-web";
import { useRouter } from "next/navigation";

import styles from "./SignInForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { useMutation } from "@tanstack/react-query";
import { SignInRequest } from "@taigalabs/prfs-entities/bindings/SignInRequest";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { metamaskWallet, useConnect } from "@thirdweb-dev/react";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { signIn } from "@/state/userReducer";
import useLocalWallet from "@/hooks/useLocalWallet";

const metamaskConfig = metamaskWallet();
const prfs = new PrfsSDK("test");

const SignInForm: React.FC<{}> = () => {
  const i18n = React.useContext(i18nContext);
  const [proofGenElement, setProofGenElement] = React.useState<ProofGenElement>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const connect = useConnect();
  const localPrfsAccount = useAppSelector(state => state.user.localPrfsAccount);
  useLocalWallet(dispatch);

  const mutation = useMutation({
    mutationFn: (req: SignInRequest) => {
      return prfsApi2("sign_in_prfs_account", req);
    },
  });

  const handleClickSignUp = React.useCallback(() => {
    router.push(paths.sign_up);
  }, [router]);

  const handleClickSignIn = React.useCallback(async () => {
    if (proofGenElement) {
      const formValues = await proofGenElement.getFormValues();

      if (formValues) {
        const wallet = await connect(metamaskConfig);
        const walletAddr = await wallet.getAddress();

        const sig = formValues.passcode;
        const { payload } = await mutation.mutateAsync({ account_id: sig });

        dispatch(
          signIn({
            prfsAccount: payload.prfs_account,
            walletAddr,
          })
        );

        router.push(paths.__);
      }
    }
  }, [proofGenElement]);

  React.useEffect(() => {
    async function fn() {
      if (localPrfsAccount) {
        console.log(22, localPrfsAccount);
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const proofGenElement = prfs.create("zauth-sign-in", {
        provider,
      });

      await proofGenElement.mount("#prfs-sdk-container");

      setProofGenElement(proofGenElement);
    }

    fn().then();
  }, [localPrfsAccount]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <p className={styles.bigLogo}>{i18n.vacade}</p>
      </div>
      <div className={styles.right}>
        <div>
          <div id="prfs-sdk-container"></div>
          <button className={styles.signInBtn} onClick={handleClickSignIn}>
            {i18n.sign_in}
          </button>
        </div>
        <div className={styles.createAccount}>
          <p>{i18n.not_have_an_account}</p>
          <button className={styles.signUpBtn} onClick={handleClickSignUp}>
            {i18n.create_account}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
