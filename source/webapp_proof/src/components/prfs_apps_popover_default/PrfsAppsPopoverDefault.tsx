import React from "react";
import PrfsAppsPopover from "@taigalabs/prfs-react-components/src/prfs_apps_popover/PrfsAppsPopover";
import {
  PrfsAppsPopoverLi,
  PrfsAppsPopoverUl,
} from "@taigalabs/prfs-react-components/src/prfs_apps_popover/Modal";
import { TbCertificate } from "@taigalabs/prfs-react-components/src/tabler_icons/TbCertificate";
import { TbMathPi } from "@taigalabs/prfs-react-components/src/tabler_icons/TbMathPi";
import { GrMonitor } from "@react-icons/all-files/gr/GrMonitor";

import styles from "./PrfsAppsPopoverDefault.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import { useUrls } from "@/hooks/useUrls";

const PrfsAppsPopoverDefault: React.FC<PrfsAppsPopoverDefaultProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { tutorialUrl, accVerrificationUrl } = useUrls();

  return (
    <PrfsAppsPopover>
      <PrfsAppsPopoverUl>
        <PrfsAppsPopoverLi>
          <a href={process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}>
            <span>{i18n.documentation}</span>
          </a>
        </PrfsAppsPopoverLi>
        <PrfsAppsPopoverLi>
          <a href={tutorialUrl}>
            <span>{i18n.start_tutorial}</span>
          </a>
        </PrfsAppsPopoverLi>
      </PrfsAppsPopoverUl>
      <PrfsAppsPopoverUl>
        <PrfsAppsPopoverLi>
          <a href={accVerrificationUrl}>
            <TbCertificate />
            <span>{i18n.account_verification}</span>
          </a>
        </PrfsAppsPopoverLi>
        <PrfsAppsPopoverLi>
          <a href={process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}>
            <TbMathPi />
            <span>{i18n.proof}</span>
          </a>
        </PrfsAppsPopoverLi>
        <PrfsAppsPopoverLi>
          <a href={process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}>
            <GrMonitor />
            <span>{i18n.console}</span>
          </a>
        </PrfsAppsPopoverLi>
      </PrfsAppsPopoverUl>
    </PrfsAppsPopover>
  );
};

export default PrfsAppsPopoverDefault;

export interface PrfsAppsPopoverDefaultProps {}
