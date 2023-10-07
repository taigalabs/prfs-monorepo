"use client";

import React from "react";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import Link from "next/link";
import ActiveLink from "@taigalabs/prfs-react-components/src/active_link/ActiveLink";
import PrfsAppsPopover from "@taigalabs/prfs-react-components/src/prfs_apps_popover/PrfsAppsPopover";
import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";

import styles from "./Masthead.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const SearchBar = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.searchBar}>
      <FaSearch />
      <input placeholder={i18n.search_guide} />
    </div>
  );
};

const Masthead: React.FC<MastheadProps> = ({ variant }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        {variant !== "mini" && (
          <>
            <div className={styles.leftGroup}>
              <Link href={paths.__}>
                <Logo variant="simple" appName={i18n.proof} beta />
              </Link>
              <ul className={styles.leftMenu}>
                <li>
                  <ActiveLink href={paths.generate} exact>
                    {i18n.generate}
                  </ActiveLink>
                </li>
                <li>
                  <ActiveLink href={paths.proofs}>{i18n.proofs}</ActiveLink>
                </li>
              </ul>
            </div>
            <div className={styles.searchBarContainer}>
              <SearchBar />
            </div>
          </>
        )}
        <ul className={styles.rightGroup}>
          <li>{i18n.tutorial}</li>
          <li>{i18n.docs}</li>
          <li>
            <PrfsAppsPopover
              webappPollEndpoint={process.env.NEXT_PUBLIC_WEBAPP_POLL_ENDPOINT}
              webappProofEndpoint={process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}
              webappConsoleEndpoint={process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}
            />
          </li>
          {/* <li>{i18n.account}</li> */}
        </ul>
      </div>
    </div>
  );
};

export default Masthead;

export interface MastheadProps {
  variant?: "mini";
}
