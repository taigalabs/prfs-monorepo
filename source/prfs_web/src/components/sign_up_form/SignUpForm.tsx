import React from "react";
import { useConnect, metamaskWallet } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";

import styles from "./SignUpForm.module.scss";
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
import { FormTitle, FormTitleRow } from "@/components/form/Form";
import FormTextInput from "@/components/form/FormTextInput";
import StrikeThroughText from "@/components/strike_through_text/StrikeThroughText";
import prfsBackend from "@/fetch/prfsBackend";

const metamaskConfig = metamaskWallet();

const SignUpForm: React.FC<SignUpFormProps> = () => {
  let i18n = React.useContext(i18nContext);
  const connect = useConnect();
  const { dispatch } = React.useContext(stateContext);
  const router = useRouter();

  useLocalWallet(dispatch);

  const [walletAddr, setWalletAddr] = React.useState("");
  const [hashAlert, setHashAlert] = React.useState("");
  const [passcode, setPasscode] = React.useState("");
  const [passcodeConfirm, setPasscodeConfirm] = React.useState("");
  const [passhash, setPasshash] = React.useState("");
  const [signUpAlert, setSignUpAlert] = React.useState("");

  const handleChangePasscode = React.useCallback(
    (ev: any) => {
      setPasscode(ev.target.value);
    },
    [setPasscode]
  );

  const handleChangePasscodeConfirm = React.useCallback(
    (ev: any) => {
      setPasscodeConfirm(ev.target.value);
    },
    [setPasscodeConfirm]
  );

  const handleClickHash = React.useCallback(() => {
    async function fn() {
      if (passcode.length < 0) {
        setHashAlert("Passcode is too short");
        setPasshash("");
        return;
      }

      if (passcode !== passcodeConfirm) {
        setHashAlert("Two passcodes are not identical");
        setPasshash("");
        return;
      }

      let prfs_pw_msg = `PRFS_PW_${passcode}`;
      let pw_hash = ethers.utils.hashMessage(prfs_pw_msg);

      setHashAlert("");
      setPasshash(pw_hash);
    }

    fn().then();
  }, [passcode, passcodeConfirm, setPasshash, setHashAlert]);

  const handleClickSignUp = React.useCallback(() => {
    async function fn() {
      if (walletAddr.length < 1) {
        setSignUpAlert("Connect a wallet first");
        return;
      }

      if (passhash.length < 1) {
        setSignUpAlert("Hash passcode first");
        return;
      }

      const wallet = await connect(metamaskConfig);
      const signer = await wallet.getSigner();
      const sig = await signer.signMessage(passhash);

      try {
        let resp = await prfsBackend.signUpPrfsAccount(sig);
        if (resp.error) {
          throw new Error(resp.error);
        }

        dispatch({
          type: "sign_up",
          payload: {
            ...resp.payload,
            walletAddr,
          },
        });

        router.push("/");
      } catch (err) {
        setSignUpAlert(`sign up err, err: ${err}`);
      }
    }

    fn().then();
  }, [walletAddr, passhash, setSignUpAlert]);

  const handleClickSignIn = React.useCallback(() => {
    router.push("/signin");
  }, [router]);

  const handleConnect = React.useCallback(
    (addr: string) => {
      setWalletAddr(addr);
    },
    [setWalletAddr]
  );

  return (
    <div>
      <FormTitleRow>
        <FormTitle>{i18n.sign_up}</FormTitle>
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
                  <FormTextInput
                    type="password"
                    label={i18n.passcode}
                    handleChange={handleChangePasscode}
                  />
                </div>
                <div className={styles.passcode}>
                  <FormTextInput
                    type="password"
                    label={i18n.passcode_confirm}
                    handleChange={handleChangePasscodeConfirm}
                  />
                </div>
                {hashAlert.length > 0 && <div className={styles.hashAlert}>{hashAlert}</div>}
                <div className={styles.hashBtnRow}>
                  <Button variant="a" handleClick={handleClickHash}>
                    {i18n.hash}
                  </Button>
                </div>
                {passhash && (
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
            <Button variant="b" handleClick={handleClickSignUp}>
              {i18n.sign_up}
            </Button>
          </div>
          {signUpAlert.length > 0 && <div className={styles.signUpAlert}>{signUpAlert}</div>}
        </div>
        <div className={styles.suggestion}>
          <StrikeThroughText>{i18n.or}</StrikeThroughText>
          <div>
            <Button variant="transparent_a" handleClick={handleClickSignIn}>
              {i18n.sign_in_to_existing}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;

export interface SignUpFormProps {}
