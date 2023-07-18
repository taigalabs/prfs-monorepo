import React from "react";
import Link from "next/link";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import styles from "./Masthead.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Logo from "@/components/logo/Logo";
import { stateContext } from "@/contexts/state";
import { PrfsAccount } from "@/state/reducer";

const AccountStat: React.FC<AccountStatProps> = ({ account }) => {
  const { walletAddr, id } = account;
  let shortWalletAddr = `WLT ${walletAddr.substring(0, 7)}`;

  return (
    <div className={styles.accountStat}>
      <div>
        <div>{id}</div>
        <div>{shortWalletAddr}</div>
      </div>
      <div>
        <ArrowDropDownIcon />
      </div>
    </div>
  );
};

const Masthead: React.FC<any> = () => {
  const i18n = React.useContext(i18nContext);
  const { state, dispatch } = React.useContext(stateContext);
  const { prfsAccount } = state;

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftMenu}>
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <div>
        <ul className={styles.mainMenu}>
          <li>{i18n.learn}</li>
        </ul>
      </div>
      <div className={styles.rightMenu}>
        {prfsAccount ? <AccountStat account={prfsAccount} /> : <Link href="/signin">connect</Link>}
      </div>
    </div>
  );
};

export default Masthead;

export interface AccountStatProps {
  account: PrfsAccount;
}
