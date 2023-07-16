import React from "react";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import classnames from "classnames";

import styles from "./ConnectWalletWidget.module.scss";
import { I18nContext } from "@/contexts";
import Widget from "@/components/widget/Widget";

const ConnectWalletWidget: React.FC<any> = ({ className }) => {
  const i18n = React.useContext(I18nContext);

  return (
    <Widget label={i18n.connect_wallet} className={classnames(styles.wrapper, className)}>
      <div className={styles.widgetInner}>
        <div className={`${styles.radioBox}`}>
          <div>
            <input type="radio" value="metamask" checked />
          </div>
          <div>
            <p className={styles.label}>{i18n.metamask}</p>
            <p className={styles.desc}>{i18n.metamask_desc}</p>
          </div>
        </div>
        <div className={styles.connectBtnRow}>
          <button className={styles.connectBtn}>{i18n.connect}</button>
        </div>
      </div>
      <div className={styles.widgetInner}>
        <div>wallet status</div>
      </div>
    </Widget>
  );
};

export default ConnectWalletWidget;
