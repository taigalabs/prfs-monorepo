import React from "react";
import cn from "classnames";
import Link from "next/link";
import { FaFolder } from "@react-icons/all-files/fa/FaFolder";
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
import { PrfsAtstGroupId } from "@taigalabs/prfs-entities/bindings/PrfsAtstGroupId";

const SETS = "";
const CRYPTO_HOLDERS = "crypto_holders";
const NONCE_SEOUL_1 = "nonce_seoul_1";

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
        {/* <LeftBarItem > */}
        {/*   <CreateSetPopover /> */}
        {/* </LeftBarItem> */}
      </LeftBarTopMenu>
      <LeftBarMenu>
        <LeftBarItem>
          <Link href={paths.sets__crypto_holders}>
            <LeftBarItemButton isHighlighted={name === CRYPTO_HOLDERS}>
              <FaFolder />
              <span>{i18n.crypto_holders}</span>
            </LeftBarItemButton>
          </Link>
          <Link href={`${paths.sets}/${NONCE_SEOUL_1}`}>
            <LeftBarItemButton isHighlighted={name === NONCE_SEOUL_1}>
              <FaFolder />
              <span>Nonce Seoul community</span>
            </LeftBarItemButton>
          </Link>
        </LeftBarItem>
      </LeftBarMenu>
    </LeftBarWrapper>
  );
};

export default SetLeftBar;

export interface AttestationLeftBarProps {}
