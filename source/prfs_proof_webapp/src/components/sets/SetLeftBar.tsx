import React from "react";
import cn from "classnames";
import Link from "next/link";
import { FaLinkedin } from "@react-icons/all-files/fa/FaLinkedin";
import { FaBitcoin } from "@react-icons/all-files/fa/FaBitcoin";
import { usePathname } from "next/navigation";

import styles from "./AttestationLeftBar.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import CreateSetPopover from "./CreateSetPopover";
import {
  LeftBarItem,
  LeftBarItemButton,
  LeftBarMenu,
  LeftBarTopMenu,
  LeftBarWrapper,
} from "@/components/left_bar/LeftBar";

const SETS = "";
const CRYPTO_HOLDERS = "crypto_holders";

const SetLeftBar: React.FC<AttestationLeftBarProps> = () => {
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
          <CreateSetPopover />
        </LeftBarItem>
      </LeftBarTopMenu>
      <LeftBarMenu>
        <LeftBarItem>
          <Link href={paths.attestations__crypto_size}>
            <LeftBarItemButton isHighlighted={name === CRYPTO_HOLDERS}>
              <FaBitcoin />
              <span>{i18n.crypto_holders}</span>
            </LeftBarItemButton>
          </Link>
        </LeftBarItem>
      </LeftBarMenu>
    </LeftBarWrapper>
  );
};

export default SetLeftBar;

export interface AttestationLeftBarProps {}
