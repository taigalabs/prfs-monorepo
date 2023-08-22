"use client";

import React from "react";
import { PaddedTableWrapper } from "@taigalabs/prfs-react-components/src/table/Table";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { AiFillPlusCircle } from "react-icons/ai";
import { HiMiniDocumentPlus } from "react-icons/hi2";

import styles from "./Circuits.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { TopWidgetTitle, WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import CircuitTable from "@/components/circuit_table/CircuitTable";
import Link from "next/link";
import { paths } from "@/paths";
import { ContentAreaRow } from "@/components/content_area/ContentArea";

const Circuits: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <ContentAreaRow>
        <Widget>
          <TopWidgetTitle>
            <div className={styles.titleInner}>
              <WidgetLabel>{i18n.circuits}</WidgetLabel>
              <Button variant="transparent_aqua_blue_1" disabled>
                <Link href={`${paths.proof__circuits}?create`}>
                  <AiFillPlusCircle />
                  {i18n.create_circuit.toUpperCase()}
                </Link>
              </Button>
            </div>
          </TopWidgetTitle>
          <PaddedTableWrapper>
            <div className={styles.circuitTableContainer}>
              <CircuitTable />
            </div>
          </PaddedTableWrapper>
        </Widget>
      </ContentAreaRow>
    </DefaultLayout>
  );
};

export default Circuits;
