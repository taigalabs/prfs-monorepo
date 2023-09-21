import React from "react";
import { useConnect, metamaskWallet } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import WalletSelect from "@taigalabs/prfs-react-components/src/wallet_select/WalletSelect";
import { Msg, sendMsgToParent } from "@taigalabs/prfs-zauth-sdk";

import styles from "./SignInForm.module.scss";
import { i18nContext } from "@/contexts/i18n";

const metamaskConfig = metamaskWallet();

const SignInForm: React.FC<SignInFormProps> = () => {
  const i18n = React.useContext(i18nContext);
  const connect = useConnect();
  const router = useRouter();

  const [walletAddr, setWalletAddr] = React.useState("");
  const [passcode, setPasscode] = React.useState("");
  const [passhash, setPasshash] = React.useState("");
  const [signInAlert, setSignInAlert] = React.useState("");

  const handleChangePasscode = React.useCallback(
    (ev: any) => {
      setPasscode(ev.target.value);
    },
    [setPasscode]
  );

  const handleConnect = React.useCallback(
    (addr: string) => {
      setWalletAddr(addr);
    },
    [setWalletAddr]
  );

  const handleClickHash = React.useCallback(() => {
    async function fn() {
      if (passcode.length > 0) {
        let prfs_pw_msg = `PRFS_PW_${passcode}`;
        let pw_hash = ethers.utils.hashMessage(prfs_pw_msg);

        setPasshash(pw_hash);
      } else {
      }
    }

    fn().then();
  }, [passcode, setPasshash]);

  const handleClickConnectWallet = React.useCallback(async () => {
    const wallet = await connect(metamaskConfig);
    const signer = await wallet.getSigner();

    console.log(22, signer);
  }, []);

  const handleClickSignUp = React.useCallback(() => {
    // router.push(paths.signup);
  }, [router]);

  const handleClickSignIn = React.useCallback(async () => {
    const wallet = await connect(metamaskConfig);
    const signer = await wallet.getSigner();
    const walletAddr = await wallet.getAddress();

    try {
      const resp = await doSignIn(walletAddr, passhash, signer);

      if (!resp.payload.prfs_account) {
        throw new Error("Invalid response. Does not contain prfs account");
      }

      // sendMsgToParent()
      console.log(22, resp.payload.prfs_account);

      // signIn({
      //   prfsAccount: resp.payload.prfs_account,
      //   walletAddr,
      // });

      // router.push(paths.__);
    } catch (err) {
      console.log(err);
      setSignInAlert((err as string).toString());
    }
  }, [walletAddr, passhash, setSignInAlert]);

  return (
    <div className={styles.wrapper}>
      <div id=""></div>
      <div className={styles.inputGroup}>
        <WalletSelect
          selectedWallet={{ value: "metamask" }}
          handleSelectWallet={() => {}}
          walletAddr=""
          handleChangeWalletAddr={() => {}}
          handleClickConnectWallet={handleClickConnectWallet}
        />
      </div>
      <div className={styles.inputGroup}>
        <div className={styles.passcode}>
          <input type="password" placeholder={i18n.passcode} onChange={handleChangePasscode} />
        </div>
      </div>
      <div>{signInAlert.length > 0 && <div className={styles.signInAlert}>{signInAlert}</div>}</div>
      <div className={styles.btnRow}>
        <div>
          <Button variant="aqua_blue_1" handleClick={handleClickSignIn}>
            {i18n.sign_in}
          </Button>
        </div>
        <div>
          <button className={styles.signUpBtn} onClick={handleClickSignUp}>
            {i18n.create_new_prfs_account}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;

export interface SignInFormProps {}

export async function doSignIn(walletAddr: string, passhash: string, signer: ethers.Signer) {
  if (walletAddr.length < 1) {
    throw new Error("Connect a wallet first");
  }

  if (passhash.length < 1) {
    throw new Error("Hash passcode first");
  }

  try {
    let sig = await signer.signMessage(passhash);
    const resp = await prfsApi2("sign_in_prfs_account", { account_id: sig });

    if (resp.error) {
      throw new Error(resp.error);
    }

    return resp;
  } catch (err) {
    throw new Error(`sign in fail, err: ${err}`);
  }
}
