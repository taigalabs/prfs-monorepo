"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { AiFillFolderAdd } from "@react-icons/all-files/ai/AiFillFolderAdd";
import Link from "next/link";

import styles from "./ProofTypes.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import ProofTypeTable from "@/components/proof_type_table/ProofTypeTable";
import CreateProofTypeForm from "@/components/create_proof_type_form/CreateProofTypeForm";
import { paths } from "@/paths";
import { ContentAreaHeader, ContentAreaRow } from "@/components/content_area/ContentArea";
import { SpacedBetweenArea } from "@/components/area/Area";
import { PaddedTableWrapper } from "@/components/table2/Table2";

const Proofs: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  const searchParams = useSearchParams();
  const [createPage, setCreatePage] = React.useState(false);

  React.useEffect(() => {
    let createPage = searchParams.get("create") !== null;

    setCreatePage(createPage);
  }, [searchParams]);

  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      {createPage ? (
        <CreateProofTypeForm />
      ) : (
        <>
          <ContentAreaHeader>
            <SpacedBetweenArea>
              <WidgetLabel>{i18n.proof_types}</WidgetLabel>
              <Button variant="transparent_aqua_blue_1">
                <Link href={`${paths.proof_types}?create`}>
                  <AiFillFolderAdd />
                  <span>{i18n.create_proof_type.toUpperCase()}</span>
                </Link>
              </Button>
            </SpacedBetweenArea>
          </ContentAreaHeader>
          <ContentAreaRow>
            <PaddedTableWrapper>
              <div className={styles.tableContainer}>
                <ProofTypeTable />
              </div>
            </PaddedTableWrapper>
          </ContentAreaRow>
        </>
      )}
    </DefaultLayout>
  );
};

export default Proofs;
