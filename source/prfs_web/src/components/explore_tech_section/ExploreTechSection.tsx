import React from "react";

import styles from "./ExploreTechSection.module.scss";
import { i18nContext } from "@/contexts/i18n";
import TransparentWidget, {
  TransparentWidgetHeader,
} from "../transparent_widget/TransparentWidget";

const explore_tech_data: ExploreTechData[] = [
  {
    title: "What is zero-knowledge proof?",
    subtitle:
      "zero-knowledge proof is a method by which one party (the prover) can prove to another party (the verifier) that a given statement is true,",
    created_at: "4 days ago",
  },
  {
    title: "Bulletproofs: Short Proofs for Confidential Transactions and More",
    subtitle:
      "A new non-interactive zero-knowledge proof protocol with very short proofs and without a trusted setup",
    created_at: "4 days ago",
  },
  {
    title: "Introducing Spartan-ecdsa (@Personae Labs)",
    subtitle:
      "We introduce Spartan-ecdsa, which to our knowledge is the fastest open-source method to verify secp256k1 ECDSA signatures in zero-knowledge",
    created_at: "5 days ago",
  },
];

const ExploreTechSection: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  const [data, setData] = React.useState<ExploreTechData[]>([]);
  React.useEffect(() => {
    setData(explore_tech_data);
  }, [setData]);

  const rowsElem = React.useMemo(() => {
    let elems = data.map(row => {
      return (
        <div className={styles.row} key={row.title}>
          <div className={styles.createdAt}>{row.created_at}</div>
          <div className={styles.title}>{row.title}</div>
          <div>{row.subtitle}</div>
        </div>
      );
    });

    return elems;
  }, [data]);

  return (
    <TransparentWidget>
      <TransparentWidgetHeader>{i18n.explore_technologies}</TransparentWidgetHeader>
      <div>{rowsElem}</div>
    </TransparentWidget>
  );
};

export default ExploreTechSection;

interface ExploreTechData {
  title: string;
  subtitle: string;
  created_at: string;
}
