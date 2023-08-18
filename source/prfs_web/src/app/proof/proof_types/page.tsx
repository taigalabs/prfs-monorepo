"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaddedTableWrapper } from "@taigalabs/prfs-react-components/src/table/Table";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { HiMiniFolderPlus } from "react-icons/hi2";
import { AiFillFolderAdd } from "react-icons/ai";

import styles from "./ProofTypes.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { TopWidgetTitle, WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import ProofTypeTable from "@/components/proof_type_table/ProofTypeTable";
import CreateProofTypeForm from "@/components/create_proof_type_form/CreateProofTypeForm";
import { paths } from "@/routes/path";

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
    router.push(`${paths.proof__proof_types}?create`);
  }, [router]);

  return (
    <DefaultLayout>
      {createPage ? (
        <CreateProofTypeForm />
      ) : (
        <CardRow>
          <Card>
            <Widget>
              <TopWidgetTitle>
                <div className={styles.header}>
                  <WidgetLabel>{i18n.proof_types}</WidgetLabel>
                  <div className={styles.btnArea}>
                    <Button
                      className={styles.iconBtn}
                      variant="transparent_c"
                      handleClick={handleClickCreateProofType}
                    >
                      <AiFillFolderAdd />
                      <span>{i18n.create_proof_type.toUpperCase()}</span>
                    </Button>
                  </div>
                </div>
              </TopWidgetTitle>
              <PaddedTableWrapper>
                <ProofTypeTable />
              </PaddedTableWrapper>
            </Widget>
          </Card>
        </CardRow>
      )}
    </DefaultLayout>
  );
};

export default Proofs;
