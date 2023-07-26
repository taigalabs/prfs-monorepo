"use client";

import React from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import styles from "./Sets.module.scss";
import { stateContext } from "@/contexts/state";
import Table, { TableData } from "@/components/table/Table";
import Widget from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import CircuitTable from "@/components/circuit_table/CircuitTable";
import SetTable from "@/components/set_table/SetTable";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

const Set: React.FC<SetProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <Breadcrumb>
        <div>55</div>
        <ArrowForwardIosIcon />
        <div>55</div>
        <ArrowForwardIosIcon />
      </Breadcrumb>
      <CardRow>
        <Card>
          <Widget label={`${i18n.set} - ${params.set}`}>
            <div></div>
          </Widget>
        </Card>
      </CardRow>
    </DefaultLayout>
  );
};

export default Set;

interface SetProps {
  params: {
    set: string;
  };
}
