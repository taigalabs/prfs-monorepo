import React from "react";
import cn from "classnames";
import { FaFolder } from "@react-icons/all-files/fa/FaFolder";
import ActiveLink from "@taigalabs/prfs-react-lib/src/active_link/ActiveLink";

import styles from "./SetLeftBar.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import CreateSetPopover from "./CreateSetPopover";
import {
  LeftBarItem,
  LeftBarMenu,
  LeftBarTopMenu,
  LeftBarWrapper,
} from "@/components/left_bar/LeftBar";

const SetLeftBar: React.FC<AttestationLeftBarProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <LeftBarWrapper>
      <LeftBarTopMenu>
        {/* <LeftBarItem > */}
        {/*   <CreateSetPopover /> */}
        {/* </LeftBarItem> */}
      </LeftBarTopMenu>
      <LeftBarMenu>
        <LeftBarItem>
          <ActiveLink
            className={styles.entry}
            href={paths.sets__crypto_holders}
            activeClassName={styles.activeLink}
          >
            <FaFolder />
            <span>{i18n.crypto_holders}</span>
          </ActiveLink>
          <ActiveLink
            className={styles.entry}
            href={`${paths.sets}/nonce_seoul_1`}
            activeClassName={styles.activeLink}
          >
            <FaFolder />
            <span>Nonce Seoul community</span>
          </ActiveLink>
        </LeftBarItem>
      </LeftBarMenu>
    </LeftBarWrapper>
  );
};

export default SetLeftBar;

export interface AttestationLeftBarProps {}
