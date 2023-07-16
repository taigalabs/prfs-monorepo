import React from "react";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import classnames from "classnames";
import { useConnect, useAddress, useSigner, metamaskWallet } from "@thirdweb-dev/react";

import styles from "./ConnectWalletWidget.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget from "@/components/widget/Widget";

const metamaskConfig = metamaskWallet();

const ConnectWalletWidget: React.FC<ConnectWalletWidgetProps> = ({ className, handleConnect }) => {
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
    <Widget label={i18n.connect_wallet} className={classnames(styles.wrapper, className)}>
      <div className={styles.widgetInner}>
        <div className={`${styles.radioBox}`}>
          <div>
            <input type="radio" value="metamask" checked readOnly />
          </div>
          <div>
            <p className={styles.label}>{i18n.metamask}</p>
            <p className={styles.desc}>{i18n.metamask_desc}</p>
          </div>
        </div>
        <div className={styles.connectBtnRow}>
          <button className={styles.connectBtn} onClick={handleClickConnect}>
            {i18n.connect}
          </button>
        </div>
      </div>
      {walletAddr && (
        <div className={styles.widgetInner}>
          <div className={styles.walletAddr}>
            <p className={styles.label}>{i18n.wallet_addr}</p>
            <p className={styles.val}>{walletAddr}</p>
          </div>
        </div>
      )}
    </Widget>
  );
};

export default ConnectWalletWidget;

export interface ConnectWalletWidgetProps {
  className?: string;
  handleConnect: Function;
}
