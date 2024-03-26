import React from "react";
import PrfsAppsPopover from "@taigalabs/prfs-react-lib/src/prfs_apps_popover/PrfsAppsPopover";
import cn from "classnames";
import { TbCertificate } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbCertificate";
import { TbMathPi } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbMathPi";
import { GrMonitor } from "@react-icons/all-files/gr/GrMonitor";

import styles from "./PrfsAppsPopoverDefault.module.scss";
import { i18nContext } from "@/i18n/context";
import { useUrls } from "@/hooks/useUrls";

const PrfsAppsPopoverDefault: React.FC<PrfsAppsPopoverDefaultProps> = ({ disableMarkIsOpen }) => {
  const i18n = React.useContext(i18nContext);

  return null;
};

export default PrfsAppsPopoverDefault;

export interface PrfsAppsPopoverDefaultProps {
  disableMarkIsOpen?: boolean;
}
