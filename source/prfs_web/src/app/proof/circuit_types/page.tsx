"use client";

import React from "react";
import { PaddedTableWrapper } from "@taigalabs/prfs-react-components/src/table/Table";
import { AiFillPlusCircle } from "react-icons/ai";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";

import styles from "./CircuitTypes.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { TopWidgetTitle, WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import CircuitTypeTable from "@/components/circuit_type_table/CircuitTypeTable";
import { paths } from "@/paths";
import { ContentAreaHeader, ContentAreaRow } from "@/components/content_area/ContentArea";
import { SpacedBetweenArea } from "@/components/area/Area";

const CircuitTypes: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <ContentAreaHeader>
        <SpacedBetweenArea>
          <WidgetLabel>{i18n.circuit_types}</WidgetLabel>
          <Button variant="transparent_aqua_blue_1" disabled>
            <Link href={`${paths.proof__circuit_types}?create`}>
              <AiFillPlusCircle />
              <span>{i18n.create_circuit_type.toUpperCase()}</span>
            </Link>
          </Button>
        </SpacedBetweenArea>
      </ContentAreaHeader>
      <ContentAreaRow>
        <Widget>
          <PaddedTableWrapper>
            <div className={styles.tableContainer}>
              <CircuitTypeTable />
            </div>
          </PaddedTableWrapper>
        </Widget>
      </ContentAreaRow>
    </DefaultLayout>
  );
};

export default CircuitTypes;
