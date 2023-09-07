"use client";

import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { AiFillPlusCircle } from "@react-icons/all-files/ai/AiFillPlusCircle";

import styles from "./Circuits.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import CircuitTable from "@/components/circuit_table/CircuitTable";
import Link from "next/link";
import { paths } from "@/paths";
import {
  ContentAreaBody,
  ContentAreaHeader,
  ContentAreaRow,
} from "@/components/content_area/ContentArea";
import { SpacedBetweenArea } from "@/components/area/Area";
import { PaddedTableWrapper } from "@/components/table2/Table2";
import { useAppDispatch } from "@/state/hooks";

const Circuits: React.FC = () => {
  let i18n = React.useContext(i18nContext);

  const dispatch = useAppDispatch();
  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <ContentAreaHeader>
        <SpacedBetweenArea>
          <WidgetLabel>{i18n.circuits}</WidgetLabel>
          <Button variant="transparent_aqua_blue_1" disabled>
            <Link href={`${paths.circuits}?create`}>
              <AiFillPlusCircle />
              <span>{i18n.create_circuit.toUpperCase()}</span>
            </Link>
          </Button>
        </SpacedBetweenArea>
      </ContentAreaHeader>

      <ContentAreaBody>
        <ContentAreaRow>
          <PaddedTableWrapper>
            <CircuitTable />
          </PaddedTableWrapper>
        </ContentAreaRow>
      </ContentAreaBody>
    </DefaultLayout>
  );
};

export default Circuits;
