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
import { Set } from "@/models/index";

const SetSummary = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.setSummaryWrapper}>
      <div className={styles.col}>
        <div className={styles.cell}>
          <div className={styles.cellHeader}>{i18n.set_id}</div>
          <div>power</div>
        </div>
      </div>
      <div className={styles.col}>
        <div className={styles.cell}>cellb1</div>
        <div className={styles.cell}>cellb2</div>
        <div className={styles.cell}>cellb3</div>
      </div>
      <div className={styles.col}>
        <div className={styles.cell}>cell</div>
      </div>
    </div>
  );
};

const Set: React.FC<SetProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  const [set, setSet] = React.useState<Set>();
  React.useEffect(() => {
    prfsBackend
      .getSets({
        page: 0,
        set_id: params.set_id,
      })
      .then(resp => {
        const { sets } = resp.payload;
        console.log(11, sets);

        if (sets.length > 0) {
          setSet(sets[0]);
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
            <SetSummary />
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
