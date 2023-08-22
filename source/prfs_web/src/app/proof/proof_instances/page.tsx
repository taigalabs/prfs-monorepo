"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { PaddedTableWrapper } from "@taigalabs/prfs-react-components/src/table/Table";
import { HiMiniDocumentPlus } from "react-icons/hi2";
import Link from "next/link";

import styles from "./Proofs.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { TopWidgetTitle, WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import ProofInstanceTable from "@/components/proof_instance_table/ProofInstanceTable";
import CreateProofInstanceForm from "@/components/create_proof_instance_form/CreateProofInstanceForm";
import { paths } from "@/paths";
import { ContentAreaHeader, ContentAreaRow } from "@/components/content_area/ContentArea";

const Proofs: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  useLocalWallet(dispatch);

  const [createPage, setCreatePage] = React.useState(false);

  React.useEffect(() => {
    let createPage = searchParams.get("create") !== null;

    setCreatePage(createPage);
  }, [searchParams]);

  return (
    <DefaultLayout>
      {createPage ? (
        <CreateProofInstanceForm />
      ) : (
        <>
          <ContentAreaHeader>
            <WidgetLabel>{i18n.proof_instances}</WidgetLabel>
            <Button variant="transparent_aqua_blue_1">
              <Link href={`${paths.proof__proof_instances}?create`}>
                <HiMiniDocumentPlus />
                {i18n.create_proof_instance.toUpperCase()}
              </Link>
            </Button>
          </ContentAreaHeader>
          <ContentAreaRow>
            <Widget>
              <PaddedTableWrapper>
                <div className={styles.tableContainer}>
                  <ProofInstanceTable />
                </div>
              </PaddedTableWrapper>
            </Widget>
          </ContentAreaRow>
        </>
      )}
    </DefaultLayout>
  );
};

export default Proofs;
