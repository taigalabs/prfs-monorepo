"use client";

import React from "react";
import Link from "next/link";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import styles from "./Set.module.scss";
import { stateContext } from "@/contexts/state";
import Widget from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import SetElementTable from "@/components/set_element_table/SetElementTable";
import prfsBackend from "@/fetch/prfsBackend";
import { PrfsSet } from "@/models/index";
import ColumnarSummary, {
  ColumnarSummaryCell,
  ColumnarSummaryCellHeader,
  ColumnarSummaryColumn,
} from "@/components/columnal_summary/ColumnarSummary";
import { useRouter } from "next/navigation";

const SetSummary: React.FC<SetSummaryProps> = ({ set }) => {
  const i18n = React.useContext(i18nContext);

  return (
    set && (
      <ColumnarSummary>
        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.set_id}</ColumnarSummaryCellHeader>
            <div>{set.set_id}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.label}</ColumnarSummaryCellHeader>
            <div>{set.label}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.cardinality}</ColumnarSummaryCellHeader>
            <div>{set.cardinality}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.element_type}</ColumnarSummaryCellHeader>
            <div>{set.element_type}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>

        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.description}</ColumnarSummaryCellHeader>
            <div>{set.desc}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.hash_algorithm}</ColumnarSummaryCellHeader>
            <div>{set.hash_algorithm}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.elliptic_curve}</ColumnarSummaryCellHeader>
            <div>{set.elliptic_curve}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.finite_field}</ColumnarSummaryCellHeader>
            <div>{set.finite_field}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.merkle_root}</ColumnarSummaryCellHeader>
            <div>{set.merkle_root}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>

        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.author}</ColumnarSummaryCellHeader>
            <div>{set.author}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.created_at}</ColumnarSummaryCellHeader>
            <div>{set.created_at}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>
      </ColumnarSummary>
    )
  );
};

const Set: React.FC<SetProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);
  const router = useRouter();

  const [set, setSet] = React.useState<PrfsSet>();
  React.useEffect(() => {
    prfsBackend
      .getSets({
        page: 0,
        set_id: params.set_id,
      })
      .then(resp => {
        const { sets } = resp.payload;

        if (sets.length > 0) {
          setSet(sets[0]);
        } else {
          router.push("/sets");
        }
      });
  }, [setSet]);

  return (
    <DefaultLayout>
      <Breadcrumb>
        <div>
          <Link href="/sets">{i18n.sets}</Link>
        </div>
        <ArrowForwardIosIcon />
        <div className={styles.here}>{params.set_id}</div>
      </Breadcrumb>
      <CardRow>
        <Card>
          <Widget label={`${i18n.set} - ${params.set_id}`}>
            <SetSummary set={set} />
          </Widget>
        </Card>
      </CardRow>
      <CardRow>
        <Card>
          <Widget label={`${i18n.elements} - ${params.set_id}`}>
            <SetElementTable />
          </Widget>
        </Card>
      </CardRow>
    </DefaultLayout>
  );
};

export default Set;

interface SetProps {
  params: {
    set_id: string;
  };
}

interface SetSummaryProps {
  set: PrfsSet;
}
