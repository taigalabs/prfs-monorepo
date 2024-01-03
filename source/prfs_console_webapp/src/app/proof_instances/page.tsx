"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { HiDocumentAdd } from "@react-icons/all-files/hi/HiDocumentAdd";
import Link from "next/link";
import { PaddedTableWrapper } from "@taigalabs/prfs-react-lib/src/table2/Table2";

import styles from "./Proofs.module.scss";
import { WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/i18n/context";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import ProofInstanceTable from "@/components/proof_instance_table/ProofInstanceTable";
import CreateProofInstanceForm from "@/components/create_proof_instance_form/CreateProofInstanceForm";
import { paths } from "@/paths";
import {
  ContentAreaBody,
  ContentAreaHeader,
  ContentAreaRow,
} from "@/components/content_area/ContentArea";
import { SpacedBetweenArea } from "@/components/area/Area";
import { useAppDispatch } from "@/state/hooks";

const Proofs: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const dispatch = useAppDispatch();
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
      <ContentAreaHeader>
        <SpacedBetweenArea>
          <WidgetLabel>{i18n.proof_instances}</WidgetLabel>
          <Button variant="transparent_aqua_blue_1">
            <Link href={`${process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}`}>
              <HiDocumentAdd />
              <span>{i18n.create_proof_instance.toUpperCase()}</span>
            </Link>
          </Button>
        </SpacedBetweenArea>
      </ContentAreaHeader>
      <ContentAreaBody>
        <ContentAreaRow>
          <PaddedTableWrapper>
            <ProofInstanceTable />
          </PaddedTableWrapper>
        </ContentAreaRow>
      </ContentAreaBody>
    </DefaultLayout>
  );
};

export default Proofs;
