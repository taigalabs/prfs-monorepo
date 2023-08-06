import React from "react";

import styles from "./ExploreTechSection.module.scss";
import { i18nContext } from "@/contexts/i18n";
import TransparentWidget, {
  TransparentWidgetHeader,
} from "../transparent_widget/TransparentWidget";

const ExploreTechSection: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <TransparentWidget>
      <TransparentWidgetHeader>{i18n.latest_prfs_updates}</TransparentWidgetHeader>
      <div>55</div>
    </TransparentWidget>
  );
};

export default ExploreTechSection;
