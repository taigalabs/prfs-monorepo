"use client";

import React from "react";
import Link from "next/link";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import styles from "./Set.module.scss";
import { stateContext } from "@/contexts/state";
import Widget, { WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";
import SetElementTable from "@/components/set_element_table/SetElementTable";
import * as prfsBackend from "@/fetch/prfsBackend";
import { PrfsSet } from "@/models/index";
import ColumnarSummary, {
  ColumnarSummaryCell,
  ColumnarSummaryCellHeader,
  ColumnarSummaryColumn,
} from "@/components/columnal_summary/ColumnarSummary";
import { useRouter } from "next/navigation";
import { TableCurrentPageLimitWarning } from "@/components/table/Table";
import SetSummary from "@/components/set_summary/SetSummary";

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
        const { prfs_sets } = resp.payload;

        if (prfs_sets.length > 0) {
          setSet(prfs_sets[0]);
        } else {
          router.push("/sets");
        }
      });
  }, [setSet]);

  let setTableLabel = `${i18n.set} summary for ${params.set_id}`;

  return (
    <DefaultLayout>
      <Breadcrumb>
        <BreadcrumbEntry>
          <Link href="/sets">{i18n.sets}</Link>
        </BreadcrumbEntry>
        <BreadcrumbEntry>{params.set_id}</BreadcrumbEntry>
      </Breadcrumb>
      <div className={styles.contentArea}>
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{setTableLabel}</WidgetLabel>
              </WidgetHeader>
              <SetSummary set={set} />
            </Widget>
          </Card>
        </CardRow>
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{i18n.elements}</WidgetLabel>
              </WidgetHeader>
              <TableCurrentPageLimitWarning />
              <SetElementTable setId={params.set_id} />
            </Widget>
          </Card>
        </CardRow>
      </div>
    </DefaultLayout>
  );
};

export default Set;

interface SetProps {
  params: {
    set_id: string;
  };
}
