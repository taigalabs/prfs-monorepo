import React from "react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { useConnect, useAddress, useSigner, metamaskWallet } from "@thirdweb-dev/react";
import Link from "next/link";

import styles from "./Masthead.module.scss";
import { I18nContext } from "@/contexts";
import Logo from "@/components/logo/Logo";

const metamaskConfig = metamaskWallet();

const Masthead: React.FC<any> = () => {
  const i18n = React.useContext(I18nContext);

  const connect = useConnect();

  let handleConnect = React.useCallback(() => {
    const fn = async () => {
      const wallet = await connect(metamaskConfig);

      console.log("wallet", wallet);
    };

    fn().then();
  }, []);

  return (
    <div className={styles.wrapper}>
      <Logo />
      <div onClick={handleConnect}>
        <Link href="/signin">connect</Link>
      </div>
    </div>
  );
};

export default Masthead;
