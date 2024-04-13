import React from "react";
import cn from "classnames";
import Link from "next/link";
import { FaLinkedin } from "@react-icons/all-files/fa/FaLinkedin";
import { MdGroup } from "@react-icons/all-files/md/MdGroup";
import { FaBitcoin } from "@react-icons/all-files/fa/FaBitcoin";
import { usePathname } from "next/navigation";

import styles from "./AttestationLeftBar.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import CreateAtstPopover from "./CreateAtstPopover";
import {
  LeftBarItem,
  LeftBarItemButton,
  LeftBarMenu,
  LeftBarTopMenu,
  LeftBarWrapper,
} from "@/components/left_bar/LeftBar";

const TWITTER = "twitter";
const CRYPTO_ASSET = "crypto_asset";
const GROUP_MEMBER = "group_member";

const AttestationLeftBar: React.FC<AttestationLeftBarProps> = () => {
  const i18n = React.useContext(i18nContext);
  const pathname = usePathname();
  const name = React.useMemo(() => {
    const segments = pathname.split("/");

    if (segments.length > 2) {
      return segments[2];
    }
    return null;
  }, [pathname]);

  return (
    <LeftBarWrapper>
      <LeftBarTopMenu>
        <LeftBarItem>
          <CreateAtstPopover />
        </LeftBarItem>
      </LeftBarTopMenu>
      <LeftBarMenu>
        <LeftBarItem>
          <Link href={`${paths.attestations}/g/crypto_1`}>
            <LeftBarItemButton isHighlighted={name === CRYPTO_ASSET}>
              <FaBitcoin />
              <span>{i18n.crypto_asset}</span>
            </LeftBarItemButton>
          </Link>
        </LeftBarItem>
        <LeftBarItem>
          <Link href={`${paths.attestations}/g/nonce_seoul_1`}>
            <LeftBarItemButton isHighlighted={name === GROUP_MEMBER}>
              <MdGroup />
              <span>{i18n.group_member}</span>
            </LeftBarItemButton>
          </Link>
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
