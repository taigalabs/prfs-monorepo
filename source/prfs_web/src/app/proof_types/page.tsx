"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
import CircuitTable from "@/components/circuit_table/CircuitTable";

const Proofs: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  const router = useRouter();

  const searchParams = useSearchParams();

  React.useEffect(() => {
    console.log(55, searchParams);
  }, [searchParams]);

  useLocalWallet(dispatch);

  const handleClickCreateProofType = React.useCallback(() => {
    router.push("/proof_types?create");
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
            <CircuitTable />
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
