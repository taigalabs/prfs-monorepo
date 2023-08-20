import React from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

import styles from "./Masthead.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Logo from "@/components/logo/Logo";
import { stateContext } from "@/contexts/state";
import PrfsAppsPopover from "./PrfsAppsPopover";
import AccountPopover from "./AccountPopover";

const ConnectButton = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <Button variant="transparent_c_light">
      <Link href="/signin">{i18n.connect}</Link>
    </Button>
  );
};

const Masthead: React.FC<any> = () => {
  const i18n = React.useContext(i18nContext);
  const { state } = React.useContext(stateContext);
  const { localPrfsAccount } = state;
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
