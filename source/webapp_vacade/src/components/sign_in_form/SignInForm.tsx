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

const prfs = new PrfsSDK("test");

const SignInForm: React.FC<{}> = () => {
  const i18n = React.useContext(i18nContext);
  const [proofGenElement, setProofGenElement] = React.useState<ProofGenElement>();
  const router = useRouter();

  const handleClickSignUp = React.useCallback(() => {
    router.push(paths.sign_up);
  }, [router]);

  const handleClickSignIn = React.useCallback(() => {
    console.log(111);
    // window.open(`${process.env.NEXT_PUBLIC_PRFS_ZAUTH_ENDPOINT}/sign_in`, "_blank");
  }, []);

  const handleCreateProof = React.useCallback(({ proof, publicInput }: any) => {
    console.log("Created proof!", proof, publicInput);
  }, []);

  React.useEffect(() => {
    async function fn() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const proofGenElement = prfs.create("zauth-sign-in", {
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
{
  /* <div id="prfs-sdk-container"></div> */
}
