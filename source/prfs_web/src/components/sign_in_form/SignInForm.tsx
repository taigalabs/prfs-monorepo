import React from "react";
import { useConnect, metamaskWallet } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";

import styles from "./SignInForm.module.scss";
import { stateContext } from "@/contexts/state";
import ConnectWalletWidget from "@/components/connect_wallet_widget/ConnectWalletWidget";
import Button from "@/components/button/Button";
import { signIn } from "@/functions/prfsAccount";
import localStore from "@/storage/localStore";
import useLocalWallet from "@/hooks/useLocalWallet";
import { i18nContext } from "@/contexts/i18n";
import Widget, { WidgetHeader, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import CardRow from "@/components/card_row/CardRow";
import Card from "@/components/card/Card";
import { FormSubtitle, FormTextInput, FormTitle, FormTitleRow } from "../form/Form";
import StrikeThroughText from "../strike_through_text/StrikeThroughText";

const metamaskConfig = metamaskWallet();

const SignInForm: React.FC<SignInFormProps> = () => {
  const i18n = React.useContext(i18nContext);
  const connect = useConnect();
  const router = useRouter();

  const { dispatch } = React.useContext(stateContext);
  useLocalWallet(dispatch);

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

  const handleClickSignUp = React.useCallback(() => {
    router.push("/signup");
  }, [router]);

  const handleClickSignIn = React.useCallback(() => {
    async function fn() {
      const wallet = await connect(metamaskConfig);
      const signer = await wallet.getSigner();
      const walletAddr = await wallet.getAddress();

      try {
        let resp = await signIn(walletAddr, passhash, signer);

        dispatch({
          type: "sign_in",
          payload: {
            ...resp.payload,
            walletAddr,
          },
        });

        localStore.putPrfsAccount(resp.payload.sig, walletAddr);

        router.push("/");
      } catch (err) {
        console.log(err);
        setSignInAlert(err.toString());
      }
    }

    fn().then();
  }, [walletAddr, passhash, setSignInAlert]);

  return (
    <div>
      <FormTitleRow>
        <FormTitle>{i18n.sign_in}</FormTitle>
      </FormTitleRow>
      <div>
        <CardRow>
          <Card>
            <ConnectWalletWidget handleConnect={handleConnect} />
          </Card>
        </CardRow>
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{i18n.credential}</WidgetLabel>
              </WidgetHeader>
              <WidgetPaddedBody>
                <div className={styles.passcode}>
                  <p className={styles.label}>Passcode</p>
                  <input type="password" onChange={handleChangePasscode} />
                </div>
                <div className={styles.hashBtnRow}>
                  <Button variant="a" handleClick={handleClickHash}>
                    {i18n.hash}
                  </Button>
                </div>
                {passhash.length > 0 && (
                  <div className={styles.hashResult}>
                    <FormTextInput label={i18n.passhash} value={passhash} />
                  </div>
                )}
              </WidgetPaddedBody>
            </Widget>
          </Card>
        </CardRow>
      </div>
      <div className={styles.btnRow}>
        <div className={styles.signInRow}>
          <div>
            <Button variant="b" handleClick={handleClickSignIn}>
              {i18n.sign_in}
            </Button>
          </div>
          {signInAlert.length > 0 && <div className={styles.signInAlert}>{signInAlert}</div>}
        </div>
        <div className={styles.suggestion}>
          <StrikeThroughText>{i18n.new_to_prfs}</StrikeThroughText>
          <div>
            <Button variant="transparent_a" handleClick={handleClickSignUp}>
              {i18n.create_new_prfs_account}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;

export interface SignInFormProps {}
