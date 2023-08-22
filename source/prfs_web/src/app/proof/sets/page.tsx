"use client";

import React from "react";
import { PaddedTableWrapper } from "@taigalabs/prfs-react-components/src/table/Table";

import styles from "./Sets.module.scss";
import { stateContext } from "@/contexts/state";
import Widget, { TopWidgetTitle, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import SetTable from "@/components/set_table/SetTable";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import { AiFillPlusCircle } from "react-icons/ai";
import { paths } from "@/paths";
import { ContentAreaRow } from "@/components/content_area/ContentArea";

const Sets: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <ContentAreaRow>
        <Widget>
          <TopWidgetTitle>
            <div className={styles.titleInner}>
              <WidgetLabel>{i18n.sets}</WidgetLabel>
              <Button variant="transparent_aqua_blue_1" disabled>
                <Link href={`${paths.proof__sets}?create`}>
                  <AiFillPlusCircle />
                  <span>{i18n.create_set.toUpperCase()}</span>
                </Link>
              </Button>
            </div>
          </TopWidgetTitle>
          <PaddedTableWrapper>
            <div className={styles.tableContainer}>
              <SetTable />
            </div>
          </PaddedTableWrapper>
        </Widget>
      </ContentAreaRow>
    </DefaultLayout>
  );
};

export default Sets;
