import React from "react";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import Link from "next/link";
import ActiveLink from "@taigalabs/prfs-react-components/src/active_link/ActiveLink";
import { ethers } from "ethers";
import { PrfsSDK } from "@taigalabs/prfs-sdk-web";
import { useRouter } from "next/navigation";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

import styles from "./SignUpForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";

const prfs = new PrfsSDK("test");

const SignUpForm: React.FC<{}> = () => {
  const i18n = React.useContext(i18nContext);
  const [proofGenElement, setProofGenElement] = React.useState<ProofGenElement>();
  const router = useRouter();

  const handleClickSignUp = React.useCallback(async () => {
    if (!proofGenElement) {
      console.error("PRFS sdk is undefined");
      return;
    }

    const formValues = await proofGenElement.getFormValues();

    // if (proveReceipt) {
    //   setProveReceipt(proveReceipt);
    // }
  }, [proofGenElement, router]);

  const handleClickSignIn = React.useCallback(() => {
    router.push(paths.sign_in);
  }, []);

  const handleCreateProof = React.useCallback(({ proof, publicInput }: any) => {
    console.log("Created proof!", proof, publicInput);
  }, []);

  React.useEffect(() => {
    async function fn() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const proofGenElement = prfs.create("zauth-sign-up", {
        provider,
        handleCreateProof,
      });

      await proofGenElement.mount("#prfs-sdk-container");

      setProofGenElement(proofGenElement);
    }

    fn().then();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <p className={styles.bigLogo}>{i18n.vacade}</p>
      </div>
      <div className={styles.right}>
        <div>
          <div id="prfs-sdk-container"></div>
          <button className={styles.signInBtn} onClick={handleClickSignUp}>
            {i18n.sign_up}
          </button>
        </div>
        <div className={styles.createAccount}>
          <p>{i18n.already_have_an_account}</p>
          <button className={styles.signUpBtn} onClick={handleClickSignIn}>
            {i18n.sign_in}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
