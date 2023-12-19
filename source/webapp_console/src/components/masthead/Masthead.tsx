import React from "react";
import Link from "next/link";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";
import PrfsAppsPopover from "@taigalabs/prfs-react-components/src/prfs_apps_popover/PrfsAppsPopover";

import styles from "./Masthead.module.scss";
import { i18nContext } from "@/i18n/context";
import AccountPopover from "./AccountPopover";
import useLocalWallet from "@/hooks/useLocalWallet";
import { useAppDispatch, useAppSelector } from "@/state/hooks";

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
  const dispatch = useAppDispatch();
  useLocalWallet(dispatch);

  const localPrfsAccount = useAppSelector(state => state.user.localPrfsAccount);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.leftMenu}>
          <div className={styles.logoContainer}>
            <Link href="/">
              <Logo variant="simple" appName={i18n.console} beta />
            </Link>
          </div>
        </div>
        <div className={styles.mainMenu}>
          <div className={styles.search}>
            <FaSearch />
            <input placeholder={i18n.search_guide} />
          </div>
        </div>
        <div className={styles.rightMenu}>
          <li>
            <a href={process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}>
              <button>{i18n.docs}</button>
            </a>
          </li>
          <li>
            {/* <PrfsAppsPopover */}
            // webappProofEndpoint={process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}
            // webappConsoleEndpoint={process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}
            // webappPollEndpoint={process.env.NEXT_PUBLIC_WEBAPP_POLL_ENDPOINT}
            {/* ></PrfsAppsPopover> */}
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
