import React from "react";
import Link from "next/link";
import { useConnect, useAddress, useSigner, metamaskWallet } from "@thirdweb-dev/react";

import styles from "./ConnectWalletWidget.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { WidgetHeader, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import FormTextInput from "@/components/form/FormTextInput";
import Button from "@/components/button/Button";

const metamaskConfig = metamaskWallet();

const ConnectWalletWidget: React.FC<ConnectWalletWidgetProps> = ({ handleConnect }) => {
  const i18n = React.useContext(i18nContext);

  const connect = useConnect();
  const [walletAddr, setWalletAddr] = React.useState(undefined);

  let handleClickConnect = React.useCallback(() => {
    async function fn() {
      const wallet = await connect(metamaskConfig);
      let signer = await wallet.getSigner();
      let addr = await signer.getAddress();
      setWalletAddr(addr);
      handleConnect(addr);
    }

    fn().then();
  }, [setWalletAddr]);

  return (
    <Widget>
      <WidgetHeader>
        <WidgetLabel>{i18n.connect_wallet}</WidgetLabel>
      </WidgetHeader>
      <WidgetPaddedBody>
        <div className={styles.radioBox}>
          <div>
            <input type="radio" value="metamask" checked readOnly />
          </div>
          <div>
            <p className={styles.label}>{i18n.metamask}</p>
            <p className={styles.desc}>{i18n.metamask_desc}</p>
          </div>
        </div>
        <div className={styles.connectBtnRow}>
          <Button variant="a" handleClick={handleClickConnect}>
            {i18n.connect}
          </Button>
        </div>
        {walletAddr && (
          <div className={styles.walletAddr}>
            <FormTextInput label={i18n.wallet_addr} value={walletAddr} />
          </div>
        )}
      </WidgetPaddedBody>
    </Widget>
  );
};

export default ConnectWalletWidget;

export interface ConnectWalletWidgetProps {
  handleConnect: Function;
}
