"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "./ProofTypes.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import Button from "@/components/button/Button";
import ProofTypeTable from "@/components/proof_type_table/ProofTypeTable";
import CreateProofTypeForm from "@/components/create_proof_type_form/CreateProofTypeForm";

const Proofs: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [createPage, setCreatePage] = React.useState(false);

  React.useEffect(() => {
    let createPage = searchParams.get("create") !== null;

    setCreatePage(createPage);
  }, [searchParams]);

  useLocalWallet(dispatch);

  const handleClickCreateProofType = React.useCallback(() => {
    router.push("/proof_types?create");
  }, [router]);

  return (
    <DefaultLayout>
      {createPage ? (
        <CreateProofTypeForm />
      ) : (
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <div className={styles.proofTypesHeader}>
                  <WidgetLabel>{i18n.proof_types}</WidgetLabel>
                  <div className={styles.btnArea}>
                    <Button variant="a" handleClick={handleClickCreateProofType}>
                      {i18n.create_proof_type}
                    </Button>
                  </div>
                </div>
              </WidgetHeader>
              <ProofTypeTable />
            </Widget>
          </Card>
        </CardRow>
      )}
    </DefaultLayout>
  );
};

export default Proofs;
