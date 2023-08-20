import React from "react";
import Link from "next/link";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import classNames from "classnames";
import { BsWallet2 } from "react-icons/bs";
import IconButton from "@taigalabs/prfs-react-components/src/icon_button/IconButton";
import { FaTools } from "react-icons/fa";
import { IoIosSchool } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { usePathname } from "next/navigation";

import styles from "./Masthead.module.scss";
import localStore from "@/storage/localStore";
import { i18nContext } from "@/contexts/i18n";
import Logo from "@/components/logo/Logo";
import { stateContext } from "@/contexts/state";
import { PrfsAccount } from "@/state/reducer";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import PrfsAppsPopover from "./PrfsAppsPopover";
import { paths } from "@/routes/path";
import AccountPopover from "./AccountPopover";

const ConnectButton = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.connectBtn}>
      <Link href="/signin">{i18n.connect}</Link>
    </div>
  );
};

const Masthead: React.FC<any> = () => {
  const i18n = React.useContext(i18nContext);
  const { state } = React.useContext(stateContext);
  const { prfsAccount } = state;
  const path = usePathname();
  const [appName, setAppName] = React.useState("");

  React.useEffect(() => {
    const pathSegments = path.split("/");
    if (pathSegments.length > 1) {
      const appName = pathSegments[1];
      setAppName(appName.charAt(0).toUpperCase() + appName.slice(1));
    }
  }, [path, setAppName]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.leftMenu}>
          <div className={styles.logoContainer}>
            <Link href="/">
              <Logo variant="simple" />
            </Link>
          </div>
          <div className={styles.appName}>{appName}</div>
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
          {prfsAccount ? <AccountPopover account={prfsAccount} /> : <ConnectButton />}
        </div>
      </div>
    </div>
  );
};

export default Masthead;

export interface AccountStatProps {
  account: PrfsAccount;
}
