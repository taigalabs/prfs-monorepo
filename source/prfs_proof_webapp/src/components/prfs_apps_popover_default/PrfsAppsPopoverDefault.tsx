import React from "react";
import PrfsAppsPopover from "@taigalabs/prfs-react-components/src/prfs_apps_popover/PrfsAppsPopover";
import cn from "classnames";
import {
  PrfsAppsPopoverLi,
  PrfsAppsPopoverUl,
} from "@taigalabs/prfs-react-components/src/prfs_apps_popover/Modal";
import { TbCertificate } from "@taigalabs/prfs-react-components/src/tabler_icons/TbCertificate";
import { TbMathPi } from "@taigalabs/prfs-react-components/src/tabler_icons/TbMathPi";
import { GrMonitor } from "@react-icons/all-files/gr/GrMonitor";

import styles from "./PrfsAppsPopoverDefault.module.scss";
import { i18nContext } from "@/i18n/context";
import { useUrls } from "@/hooks/useUrls";

const PrfsAppsPopoverDefault: React.FC<PrfsAppsPopoverDefaultProps> = ({ disableMarkIsOpen }) => {
  const i18n = React.useContext(i18nContext);
  const { tutorialUrl, attestationsUrl } = useUrls();

  return (
    <PrfsAppsPopover
      tooltip={i18n.apps}
      isOpenClassName={cn({ [styles.popoverIsOpen]: !disableMarkIsOpen })}
    >
      <PrfsAppsPopoverUl>
        <PrfsAppsPopoverLi noPadding>
          <a href={process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT} className={styles.item}>
            <span>{i18n.documentation}</span>
          </a>
        </PrfsAppsPopoverLi>
        <PrfsAppsPopoverLi noPadding>
          <a href={tutorialUrl} className={styles.item}>
            <span>{i18n.start_tutorial}</span>
          </a>
        </PrfsAppsPopoverLi>
      </PrfsAppsPopoverUl>
      <PrfsAppsPopoverUl>
        <PrfsAppsPopoverLi noPadding>
          <a href={attestationsUrl} className={styles.item}>
            <TbCertificate />
            <span>{i18n.attestations}</span>
          </a>
        </PrfsAppsPopoverLi>
        <PrfsAppsPopoverLi noPadding>
          <a href={process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT} className={styles.item}>
            <TbMathPi />
            <span>{i18n.proof}</span>
          </a>
        </PrfsAppsPopoverLi>
        <PrfsAppsPopoverLi noPadding>
          <a href={process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT} className={styles.item}>
            <GrMonitor />
            <span>{i18n.console}</span>
          </a>
        </PrfsAppsPopoverLi>
      </PrfsAppsPopoverUl>
    </PrfsAppsPopover>
  );
};

export default PrfsAppsPopoverDefault;

export interface PrfsAppsPopoverDefaultProps {
  disableMarkIsOpen?: boolean;
}