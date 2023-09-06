import React from "react";

import styles from "./ExploreTechSection.module.scss";
import { i18nContext } from "@/contexts/i18n";
import TransparentWidget, {
  TransparentWidgetData,
  TransparentWidgetEntry,
  TransparentWidgetHeader,
} from "../transparent_widget/TransparentWidget";

const exploreTechData: TransparentWidgetData[] = [
  {
    title: "What is zero-knowledge proof?",
    subtitle:
      "zero-knowledge proof is a method by which one party (the prover) can prove to another party (the verifier) that a given statement is true,",
    created_at: "4 days ago",
    link: "https://en.wikipedia.org/wiki/Zero-knowledge_proof",
  },
  {
    title: "Bulletproofs: Short Proofs for Confidential Transactions and More",
    subtitle:
      "A new non-interactive zero-knowledge proof protocol with very short proofs and without a trusted setup",
    created_at: "4 days ago",
    link: "https://eprint.iacr.org/2017/1066.pdf",
  },
  {
    title: "Introducing Spartan-ecdsa (@Personae Labs)",
    subtitle:
      "We introduce Spartan-ecdsa, which to our knowledge is the fastest open-source method to verify secp256k1 ECDSA signatures in zero-knowledge",
    created_at: "5 days ago",
    link: "https://personaelabs.org/posts/spartan-ecdsa/",
  },
];

const ExploreTechSection: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  const [data, setData] = React.useState<TransparentWidgetData[]>([]);
  React.useEffect(() => {
    setData(exploreTechData);
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
      <TransparentWidgetHeader>{i18n.explore_technologies}</TransparentWidgetHeader>
      <div>{rowsElem}</div>
    </TransparentWidget>
  );
};

export default ExploreTechSection;
