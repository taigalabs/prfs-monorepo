import React from "react";
import Link from "next/link";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

import styles from "./Masthead.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Logo from "@/components/logo/Logo";
import { stateContext } from "@/contexts/state";
import PrfsAppsPopover from "./PrfsAppsPopover";
import AccountPopover from "./AccountPopover";
import useLocalWallet from "@/hooks/useLocalWallet";

const ConnectButton = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <Button variant="transparent_aqua_blue_1_light">
      <Link href="/signin">{i18n.connect}</Link>
    </Button>
  );
};

const Masthead: React.FC<any> = () => {
  const i18n = React.useContext(i18nContext);
  const { state } = React.useContext(stateContext);
  const { dispatch } = React.useContext(stateContext);
  const { localPrfsAccount } = state;

  useLocalWallet(dispatch);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.leftMenu}>
          <div className={styles.logoContainer}>
            <Link href="/">
              <Logo variant="simple" />
            </Link>
          </div>
          <div className={styles.appName}>{i18n.proof}</div>
          <div className={styles.betaTag}>Beta</div>
        </div>
        <div className={styles.mainMenu}>
          <div className={styles.search}>
            <FaSearch />
            <input placeholder={i18n.search_guide} />
          </div>
        </div>
        <div className={styles.rightMenu}>
          <li className={styles.inactive}>
            <button>{i18n.learn.toUpperCase()}</button>
          </li>
          <li className={styles.inactive}>
            <button>{i18n.sdk_api.toUpperCase()}</button>
          </li>
          <li>
            <PrfsAppsPopover />
          </li>
          {localPrfsAccount ? (
            <AccountPopover localPrfsAccount={localPrfsAccount} />
          ) : (
            <ConnectButton />
          )}
        </div>
      </div>
    </div>
  );
};

export default Masthead;
