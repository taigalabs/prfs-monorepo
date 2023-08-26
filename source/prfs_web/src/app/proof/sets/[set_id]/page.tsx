"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import { TableCurrentPageLimitWarning } from "@taigalabs/prfs-react-components/src/table/Table";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";

import styles from "./Set.module.scss";
import { stateContext } from "@/contexts/state";
import { WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import SetElementTable from "@/components/set_element_table/SetElementTable";
import SetDetailTable from "@/components/set_detail_table/SetDetailTable";
import { paths } from "@/paths";
import { ContentAreaHeader, ContentAreaRow } from "@/components/content_area/ContentArea";

const Set: React.FC<SetProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);
  const router = useRouter();

  const [prfsSet, setPrfsSet] = React.useState<PrfsSet>();
  React.useMemo(async () => {
    try {
      const { payload } = await prfsApi.getPrfsSetBySetId({
        set_id: params.set_id,
      });

      setPrfsSet(payload.prfs_set);
    } catch (err) {
      console.error(err);
    }
  }, [setPrfsSet]);

  let setTableLabel = `${i18n.set} summary for ${params.set_id}`;

  return (
    <DefaultLayout>
      <ContentAreaHeader>
        <Link href={paths.proof__sets}>
          <ArrowButton variant="left" />
        </Link>
        <WidgetLabel>{setTableLabel}</WidgetLabel>
      </ContentAreaHeader>

      <div className={styles.contentBody}>
        <ContentAreaRow>
          <div className={styles.singleColRow}>
            <div className={styles.tableContainer}>
              <SetDetailTable prfsSet={prfsSet} />
            </div>
          </div>
        </ContentAreaRow>

        <ContentAreaRow>
          <div className={styles.singleColRow}>
            <div className={styles.tableTitle}>{i18n.elements}</div>
            <SetElementTable setId={params.set_id} prfsSet={prfsSet} />
          </div>
        </ContentAreaRow>
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
