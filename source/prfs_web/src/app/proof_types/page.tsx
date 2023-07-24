"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./ProofTypes.module.scss";
import Table, { TableData } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import Widget from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import prfsBackend from "@/fetch/prfsBackend";
import CardRow from "@/components/card_row/CardRow";
import Button from "@/components/button/Button";

const Proofs: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  const router = useRouter();

  useLocalWallet(dispatch);

  const createColumns = React.useCallback((keys: ReadonlyArray<CircuitTableKeys>) => {
    return (
      <div className={styles.tableHeader}>
        <div key={keys[0]} className={styles.id}>
          {i18n.id}
        </div>
        <div key={keys[1]} className={styles.name}>
          {i18n.name}
        </div>
        <div key={keys[2]} className={styles.author}>
          {i18n.author}
        </div>
        <div key={keys[3]} className={styles.numInputs}>
          {i18n.num_inputs}
        </div>
        <div key={keys[4]} className={styles.desc}>
          {i18n.description}
        </div>
        <div key={keys[5]} className={styles.createdAt}>
          {i18n.created_at}
        </div>
      </div>
    );
  }, []);

  const createRows = React.useCallback((data: TableData<CircuitTableKeys>) => {
    // console.log(1, data);
    let { page, values } = data;

    let rows = [];
    if (values === undefined || values.length < 1) {
      return rows;
    }

    for (let val of values) {
      let row = (
        <div key={val.id} className={styles.tableRow}>
          <div key="id" className={styles.id}>
            {val.id}
          </div>
          <div key="name" className={styles.name}>
            {val.name}
          </div>
          <div key="author" className={styles.author}>
            {val.author}
          </div>
          <div key="num_public_inputs" className={styles.numInputs}>
            {val.num_public_inputs}
          </div>
          <div key="desc" className={styles.desc}>
            {val.desc}
          </div>
          <div key="created_at" className={styles.createdAt}>
            {val.created_at}
          </div>
        </div>
      );

      rows.push(row);
    }

    return <div key={page}>{rows}</div>;
  }, []);

  const handleChangeCircuitPage = React.useCallback(async (page: number) => {
    return prfsBackend
      .getNativeCircuits({
        page,
      })
      .then(resp => {
        const { page, circuits } = resp.payload;
        return {
          page,
          values: circuits,
        };
      });
  }, []);

  const handleClickCreateProofType = React.useCallback(() => {
    router.push("/create_proof_type");
  }, [router]);

  const proofTypesHeader = (
    <div className={styles.proofTypesHeader}>
      <div className={styles.label}>{i18n.proof_types}</div>
      <div>
        <Button variant="a" handleClick={handleClickCreateProofType}>
          {i18n.create_proof_type}
        </Button>
      </div>
    </div>
  );

  return (
    <DefaultLayout>
      <CardRow>
        <Card>
          <Widget label={i18n.proof_types} headerElem={proofTypesHeader}>
            <Table
              keys={CIRCUIT_TABLE_KEYS}
              createColumns={createColumns}
              createRows={createRows}
              onChangePage={handleChangeCircuitPage}
            />
          </Widget>
        </Card>
      </CardRow>
    </DefaultLayout>
  );
};

export default Proofs;

const CIRCUIT_TABLE_KEYS = [
  "id",
  "name",
  "author",
  "num_public_inputs",
  "desc",
  "created_at",
] as const;

type CircuitTableKeys = (typeof CIRCUIT_TABLE_KEYS)[number];
