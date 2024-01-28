import React from "react";
import cn from "classnames";
import Link from "next/link";
import { FaLinkedin } from "@react-icons/all-files/fa/FaLinkedin";
import { FaBitcoin } from "@react-icons/all-files/fa/FaBitcoin";
import { usePathname } from "next/navigation";

import styles from "./ProofTypeLeftBar.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import CreateProofTypePopover from "./CreateProofTypePopover";
import {
  LeftBarItem,
  LeftBarItemButton,
  LeftBarMenu,
  LeftBarTopMenu,
  LeftBarWrapper,
} from "@/components/left_bar/LeftBar";

const TWITTER = "twitter";
const CRYPTO_ASSET_SIZE = "crypto_asset_size";

const ProofTypeLeftbar: React.FC<AttestationLeftBarProps> = () => {
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
          <CreateProofTypePopover />
        </LeftBarItem>
      </LeftBarTopMenu>
      <LeftBarMenu>
        <LeftBarItem>
          <Link href={paths.proof_types}>
            <LeftBarItemButton isHighlighted={true}>
              <span>{i18n.all}</span>
            </LeftBarItemButton>
          </Link>
        </LeftBarItem>
        <LeftBarItem>
          <Link href={paths.attestations__crypto_asset_size}>
            <LeftBarItemButton isHighlighted={name === CRYPTO_ASSET_SIZE}>
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

export default ProofTypeLeftbar;

export interface AttestationLeftBarProps {}
