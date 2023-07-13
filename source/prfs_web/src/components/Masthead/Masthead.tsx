import React from 'react';
import { ConnectWallet } from "@thirdweb-dev/react";
import { useConnect, useAddress, useSigner, metamaskWallet } from "@thirdweb-dev/react";

import styles from './Masthead.module.css';
import { I18nContext } from '@/contexts';

const metamaskConfig = metamaskWallet();

const Logo = ({
  label,
}) => {
  return (
    <div>{label}</div>
  );
};

const Masthead: React.FC<any> = () => {
  const i18n = React.useContext(I18nContext);

  const connect = useConnect();

  let handleConnect = React.useCallback(() => {
    const fn = async () => {
      const wallet = await connect(metamaskConfig);

      console.log('wallet', wallet);
    };

    fn().then();
  }, []);

  return (
    <div className={styles.wrapper}>
      <Logo label={i18n.logo_label} />
      <div onClick={handleConnect}>connect</div>
      {/* <ConnectWallet theme="dark" /> */}
    </div>
  );
};

export default Masthead;

