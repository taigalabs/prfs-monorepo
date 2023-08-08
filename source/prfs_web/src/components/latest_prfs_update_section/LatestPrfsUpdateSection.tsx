import React from "react";

import styles from "./LatestPrfsUpdateSection.module.scss";
import { i18nContext } from "@/contexts/i18n";
import TransparentWidget, {
  TransparentWidgetData,
  TransparentWidgetHeader,
  TransparentWidgetEntry,
} from "../transparent_widget/TransparentWidget";

const latestPrfsData: TransparentWidgetData[] = [
  {
    title: "Proof generate using Ethereum ledger data",
    subtitle: "Users can create proof using the values extracted from the source of truth",
    created_at: "4 days ago",
    link: "",
  },
  {
    title: "Proof type customization",
    subtitle: "Users can create their own proof types",
    created_at: "5 days ago",
    link: "",
  },
];

const ExploreTechSection: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  const [data, setData] = React.useState<TransparentWidgetData[]>([]);
  React.useEffect(() => {
    setData(latestPrfsData);
  }, [setData]);

  const rowsElem = React.useMemo(() => {
    let elems = data.map(row => {
      return (
        <TransparentWidgetEntry
          key={row.title}
          createdAt={row.created_at}
          title={row.title}
          subtitle={row.subtitle}
          link={row.link}
        />
      );
    });

    return elems;
  }, [data]);

  return (
    <TransparentWidget>
      <TransparentWidgetHeader>{i18n.latest_prfs_updates}</TransparentWidgetHeader>
      <div>{rowsElem}</div>
    </TransparentWidget>
  );
};

export default ExploreTechSection;
