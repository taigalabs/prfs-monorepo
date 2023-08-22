"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import {
  PaddedTableWrapper,
  TableCurrentPageLimitWarning,
} from "@taigalabs/prfs-react-components/src/table/Table";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";

import styles from "./Set.module.scss";
import { stateContext } from "@/contexts/state";
import Widget, { TopWidgetTitle, WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import SetElementTable from "@/components/set_element_table/SetElementTable";
import SetSummary from "@/components/set_summary/SetSummary";
import { PaddedSummaryWrapper } from "@/components/columnal_summary/ColumnarSummary";
import { paths } from "@/paths";

const Set: React.FC<SetProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);
  const router = useRouter();

  const [set, setSet] = React.useState<PrfsSet>();
  React.useEffect(() => {
    prfsApi
      .getSets({
        page: 0,
        set_id: params.set_id,
      })
      .then(resp => {
        const { prfs_sets } = resp.payload;

        if (prfs_sets.length > 0) {
          setSet(prfs_sets[0]);
        } else {
          console.error("Set not found");

          // router.push(paths.proof__sets);
        }
      });
  }, [setSet]);

  let setTableLabel = `${i18n.set} summary for ${params.set_id}`;

  return (
    <DefaultLayout>
      <CardRow>
        <Card>
          <Widget>
            <TopWidgetTitle>
              <div className={styles.header}>
                <Link href={paths.proof__sets}>
                  <ArrowButton variant="left" />
                </Link>
                <WidgetLabel>{setTableLabel}</WidgetLabel>
              </div>
            </TopWidgetTitle>

            <PaddedSummaryWrapper>
              <SetSummary set={set} />
            </PaddedSummaryWrapper>
          </Widget>
        </Card>
      </CardRow>

      <CardRow>
        <Card>
          <Widget>
            <WidgetHeader>
              <WidgetLabel>{i18n.elements}</WidgetLabel>
            </WidgetHeader>
            <PaddedTableWrapper>
              <TableCurrentPageLimitWarning />
              <SetElementTable setId={params.set_id} />
            </PaddedTableWrapper>
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
