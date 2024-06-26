import React from "react";
import cn from "classnames";
import ActiveLink from "@taigalabs/prfs-react-lib/src/active_link/ActiveLink";

import styles from "./ProofTypeLeftBar.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import CreateProofTypePopover from "./CreateProofTypePopover";
import {
  LeftBarItem,
  LeftBarMenu,
  LeftBarTopMenu,
  LeftBarWrapper,
} from "@/components/left_bar/LeftBarComponents";

const ProofTypeLeftbar: React.FC<AttestationLeftBarProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <LeftBarWrapper>
      <LeftBarTopMenu>
        <LeftBarItem>
          <CreateProofTypePopover />
        </LeftBarItem>
      </LeftBarTopMenu>
      <LeftBarMenu>
        <LeftBarItem>
          <ActiveLink
            className={styles.entry}
            href={paths.proof_types}
            activeClassName={styles.activeLink}
          >
            <span>{i18n.all}</span>
          </ActiveLink>
        </LeftBarItem>
      </LeftBarMenu>
    </LeftBarWrapper>
  );
};

export default ProofTypeLeftbar;

export interface AttestationLeftBarProps {}
