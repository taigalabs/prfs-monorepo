import React from "react";
import cn from "classnames";
import Link from "next/link";
import { FaLinkedin } from "@react-icons/all-files/fa/FaLinkedin";
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
const CRYPTO_SIZE = "crypto_size";
const LINKEDIN = "linkedin";

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
          <Link href={paths.attestations__twitter}>
            <LeftBarItemButton isHighlighted={name === TWITTER}>
              <img
                src="https://d1w1533jipmvi2.cloudfront.net/x-logo-black.png"
                alt="Twitter"
                crossOrigin=""
              />
              <span>{i18n.x_twitter}</span>
            </LeftBarItemButton>
          </Link>
        </LeftBarItem>
        <LeftBarItem>
          <Link href={paths.attestations__crypto_asset_size}>
            <LeftBarItemButton isHighlighted={name === CRYPTO_SIZE}>
              <FaBitcoin />
              <span>{i18n.crypto_asset_size}</span>
            </LeftBarItemButton>
          </Link>
        </LeftBarItem>
        {/* <LeftBarItem> */}
        {/*   <Link href=""> */}
        {/*     <LeftBarItemButton isHighlighted={name === LINKEDIN} disabled> */}
        {/*       <FaLinkedin /> */}
        {/*       <span>{i18n.linkedin} (Coming later)</span> */}
        {/*     </LeftBarItemButton> */}
        {/*   </Link> */}
        {/* </LeftBarItem> */}
      </LeftBarMenu>
    </LeftBarWrapper>
  );
};

export default AttestationLeftBar;

export interface AttestationLeftBarProps {}
