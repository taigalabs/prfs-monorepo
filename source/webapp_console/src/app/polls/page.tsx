"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { HiDocumentAdd } from "@react-icons/all-files/hi/HiDocumentAdd";
import Link from "next/link";
import { PaddedTableWrapper } from "@taigalabs/prfs-react-components/src/table2/Table2";

import styles from "./VotesPage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
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

const PollsPage: React.FC = () => {
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
      {createPage ? (
        <CreateProofInstanceForm />
      ) : (
        <>
          <ContentAreaHeader>
            <SpacedBetweenArea>
              <WidgetLabel>{i18n.polls}</WidgetLabel>
              <Button variant="transparent_aqua_blue_1">
                {/* <Link href={`${paths.proof_instances}?create`}> */}
                {/*   <HiDocumentAdd /> */}
                {/*   <span>{i18n.create_proof_instance.toUpperCase()}</span> */}
                {/* </Link> */}
              </Button>
            </SpacedBetweenArea>
          </ContentAreaHeader>
          <ContentAreaBody>
            <ContentAreaRow>
              {/* <PaddedTableWrapper> */}
              {/*   <ProofInstanceTable /> */}
              {/* </PaddedTableWrapper> */}
            </ContentAreaRow>
          </ContentAreaBody>
        </>
      )}
    </DefaultLayout>
  );
};

export default PollsPage;
