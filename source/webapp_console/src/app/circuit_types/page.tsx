"use client";

import React from "react";
import { AiFillPlusCircle } from "@react-icons/all-files/ai/AiFillPlusCircle";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import { PaddedTableWrapper } from "@taigalabs/prfs-react-components/src/table2/Table2";

import styles from "./CircuitTypes.module.scss";
import { i18nContext } from "@/i18n/context";
import { WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import CircuitTypeTable from "@/components/circuit_type_table/CircuitTypeTable";
import { paths } from "@/paths";
import {
  ContentAreaBody,
  ContentAreaHeader,
  ContentAreaRow,
} from "@/components/content_area/ContentArea";
import { SpacedBetweenArea } from "@/components/area/Area";
import { useAppDispatch } from "@/state/hooks";

const CircuitTypes: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const dispatch = useAppDispatch();
  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <ContentAreaHeader>
        <SpacedBetweenArea>
          <WidgetLabel>{i18n.circuit_types}</WidgetLabel>
          <Button variant="transparent_aqua_blue_1" disabled>
            <Link href={`${paths.circuit_types}?create`}>
              <AiFillPlusCircle />
              <span>{i18n.create_circuit_type.toUpperCase()}</span>
            </Link>
          </Button>
        </SpacedBetweenArea>
      </ContentAreaHeader>

      <ContentAreaBody>
        <ContentAreaRow>
          <PaddedTableWrapper>
            <CircuitTypeTable />
          </PaddedTableWrapper>
        </ContentAreaRow>
      </ContentAreaBody>
    </DefaultLayout>
  );
};

export default CircuitTypes;
