import React from "react";
import cn from "classnames";
import Link from "next/link";
import { MdGroup } from "@react-icons/all-files/md/MdGroup";
import { FaBitcoin } from "@react-icons/all-files/fa/FaBitcoin";
import ActiveLink from "@taigalabs/prfs-react-lib/src/active_link/ActiveLink";

import styles from "./AttestationLeftBar.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import CreateAtstPopover from "./CreateAtstPopover";
import {
  LeftBarItem,
  LeftBarMenu,
  LeftBarTopMenu,
  LeftBarWrapper,
} from "@/components/left_bar/LeftBarComponents";

const AttestationLeftBar: React.FC<AttestationLeftBarProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <LeftBarWrapper>
      <LeftBarTopMenu>
        <LeftBarItem>
          <CreateAtstPopover />
        </LeftBarItem>
      </LeftBarTopMenu>
      <LeftBarMenu>
        <LeftBarItem>
          <ActiveLink
            className={styles.entry}
            href={`${paths.attestations}/g/crypto_1`}
            activeClassName={styles.activeLink}
          >
            <FaBitcoin />
            <span>{i18n.crypto_asset}</span>
          </ActiveLink>
        </LeftBarItem>
        <LeftBarItem>
          <ActiveLink
            className={styles.entry}
            href={`${paths.attestations}/g/nonce_seoul_1`}
            activeClassName={styles.activeLink}
          >
            <MdGroup />
            <span>{i18n.group_member}</span>
          </ActiveLink>
        </LeftBarItem>
        {/* <LeftBarItem> */}
        {/*   <Link href={paths.attestations__twitter}> */}
        {/*     <LeftBarItemButton isHighlighted={name === TWITTER}> */}
        {/*       <img */}
        {/*         src="https://d1w1533jipmvi2.cloudfront.net/x-logo-black.png" */}
        {/*         alt="Twitter" */}
        {/*         crossOrigin="" */}
        {/*       /> */}
        {/*       <span>{i18n.x_twitter}</span> */}
        {/*     </LeftBarItemButton> */}
        {/*   </Link> */}
        {/* </LeftBarItem> */}
      </LeftBarMenu>
    </LeftBarWrapper>
  );
};

export default AttestationLeftBar;

export interface AttestationLeftBarProps {}
