"use client";

import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import { AiFillPlusCircle } from "@react-icons/all-files/ai/AiFillPlusCircle";

import styles from "./CircuitDriverPage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import DriverTable from "@/components/driver_table/DriverTable";
import { paths } from "@/paths";
import {
  ContentAreaBody,
  ContentAreaHeader,
  ContentAreaRow,
} from "@/components/content_area/ContentArea";
import { SpacedBetweenArea } from "@/components/area/Area";
import { PaddedTableWrapper } from "@/components/table2/Table2";

const Programs: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <ContentAreaHeader>
        <SpacedBetweenArea>
          <WidgetLabel>{i18n.drivers}</WidgetLabel>
          <Button variant="transparent_aqua_blue_1" disabled>
            <Link href={`${paths.circuit_drivers}?create`}>
              <AiFillPlusCircle />
              <span>{i18n.create_circuit_driver.toUpperCase()}</span>
            </Link>
          </Button>
        </SpacedBetweenArea>
      </ContentAreaHeader>
      <ContentAreaBody>
        <ContentAreaRow>
          <PaddedTableWrapper>
            <div className={styles.tableContainer}>
              <DriverTable />
            </div>
          </PaddedTableWrapper>
        </ContentAreaRow>
      </ContentAreaBody>
    </DefaultLayout>
  );
};

export default Programs;
