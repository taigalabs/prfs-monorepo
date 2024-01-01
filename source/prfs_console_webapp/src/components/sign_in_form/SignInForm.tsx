import React from "react";
// import { useConnect, metamaskWallet } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

import styles from "./SignInForm.module.scss";
import ConnectWalletWidget from "@/components/connect_wallet_widget/ConnectWalletWidget";
import { i18nContext } from "@/i18n/context";
import { FormTitle } from "@/components/form/Form";
import FormTextInput from "@/components/form/FormTextInput";
import { paths } from "@/paths";
import { useAppDispatch } from "@/state/hooks";
import { signIn } from "@/state/userReducer";

// const metamaskConfig = metamaskWallet();

const SignInForm: React.FC<SignInFormProps> = () => {
  const i18n = React.useContext(i18nContext);
  // const connect = useConnect();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [walletAddr, setWalletAddr] = React.useState("");
  const [passcode, setPasscode] = React.useState("");
  const [passhash, setPasshash] = React.useState("");
  const [signInAlert, setSignInAlert] = React.useState("");

  const handleChangePasscode = React.useCallback(
    (ev: any) => {
      setPasscode(ev.target.value);
    },
    [setPasscode],
  );

  const handleConnect = React.useCallback(
    (addr: string) => {
      setWalletAddr(addr);
    },
    [setWalletAddr],
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

  const handleClickSignUp = React.useCallback(() => {
    router.push(paths.signup);
  }, [router]);

  const handleClickSignIn = React.useCallback(() => {
    async function fn() {
      // const wallet = await connect(metamaskConfig);
      // const signer = await wallet.getSigner();
      // const walletAddr = await wallet.getAddress();
      // try {
      //   let { payload } = await doSignIn(walletAddr, passhash, signer);
      //   if (payload) {
      //     dispatch(
      //       signIn({
      //         prfsAccount: payload.prfs_account,
      //         walletAddr,
      //       }),
      //     );
      //     router.push(paths.__);
      //   }
      // } catch (err) {
      //   console.log(err);
      //   setSignInAlert((err as string).toString());
      // }
    }

    fn().then();
  }, [walletAddr, passhash, setSignInAlert]);

  return (
    <div className={styles.wrapper}>
      <FormTitle>{i18n.sign_in}</FormTitle>
      <div className={styles.inputGroup}>
        <ConnectWalletWidget handleConnect={handleConnect} />
      </div>
      <div className={styles.inputGroup}>
        <div className={styles.passcode}>
          <p className={styles.label}>Passcode</p>
          <input type="password" onChange={handleChangePasscode} />
        </div>
        <div className={styles.hashBtnRow}>
          <Button variant="transparent_aqua_blue_1" handleClick={handleClickHash}>
            {i18n.hash}
          </Button>
        </div>
        {passhash.length > 0 && (
          <div className={styles.hashResult}>
            <FormTextInput label={i18n.passhash} name="passhash" value={passhash} />
          </div>
        )}
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
