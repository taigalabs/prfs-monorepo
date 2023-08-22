"use client";

import React from "react";
import { PaddedTableWrapper } from "@taigalabs/prfs-react-components/src/table/Table";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import { AiFillPlusCircle } from "react-icons/ai";

import styles from "./CircuitDriverPage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { TopWidgetTitle, WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import CardRow from "@/components/card_row/CardRow";
import DriverTable from "@/components/driver_table/DriverTable";
import { paths } from "@/paths";

const Programs: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <CardRow>
        <Widget>
          <TopWidgetTitle>
            <div className={styles.titleInner}>
              <WidgetLabel>{i18n.drivers}</WidgetLabel>
              <Button variant="transparent_aqua_blue_1" disabled>
                <Link href={`${paths.proof__circuit_drivers}?create`}>
                  <AiFillPlusCircle />
                  {i18n.create_circuit_driver.toUpperCase()}
                </Link>
              </Button>
            </div>
          </TopWidgetTitle>
          <PaddedTableWrapper>
            <div className={styles.tableContainer}>
              <DriverTable />
            </div>
          </PaddedTableWrapper>
        </Widget>
      </CardRow>
    </DefaultLayout>
  );
};

export default Programs;
