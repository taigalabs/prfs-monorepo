"use client";

import React from "react";
import { ethers } from "ethers";

import styles from "./Sets.module.scss";
import { stateContext } from "@/contexts/state";
import Table from "@/components/table/Table";
import Widget from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";

const Sets: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <Widget label={i18n.sets}>
            <Table
              columns={[
                { key: "id", label: "Id" },
                { key: "label", label: "Label" },
                { key: "desc", label: "Desc" },
                { key: "created_at", label: "Created" },
              ]}
              onChangePage={_page => {}}
            />
          </Widget>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Sets;
