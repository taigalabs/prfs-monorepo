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
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import CircuitTypeTable from "@/components/circuit_type_table/CircuitTypeTable";
import { paths } from "@/paths";

const CircuitTypes: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <CardRow>
        <Card>
          <Widget>
            <TopWidgetTitle>
              <div className={styles.titleInner}>
                <WidgetLabel>{i18n.circuit_types}</WidgetLabel>
                <Button variant="transparent_aqua_blue_1" disabled>
                  <Link href={`${paths.proof__circuit_types}?create`}>
                    <AiFillPlusCircle />
                    {i18n.create_circuit_type.toUpperCase()}
                  </Link>
                </Button>
              </div>
            </TopWidgetTitle>
            <PaddedTableWrapper>
              <div className={styles.tableContainer}>
                <CircuitTypeTable />
              </div>
            </PaddedTableWrapper>
          </Widget>
        </Card>
      </CardRow>
    </DefaultLayout>
  );
};

export default CircuitTypes;
