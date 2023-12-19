"use client";

import React from "react";
import { AiFillPlusCircle } from "@react-icons/all-files/ai/AiFillPlusCircle";
import { useSearchParams } from "next/navigation";
import { PaddedTableWrapper } from "@taigalabs/prfs-react-components/src/table2/Table2";

import styles from "./DynamicSets.module.scss";
import Widget, { TopWidgetTitle, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/i18n/context";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import SetTable from "@/components/set_table/SetTable";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import { paths } from "@/paths";
import {
  ContentAreaBody,
  ContentAreaHeader,
  ContentAreaRow,
} from "@/components/content_area/ContentArea";
import { SpacedBetweenArea } from "@/components/area/Area";
import CreateSetForm from "@/components/create_set_form/CreateSetForm";
import { useAppDispatch } from "@/state/hooks";

const DynamicSets: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  const dispatch = useAppDispatch();
  useLocalWallet(dispatch);

  const searchParams = useSearchParams();
  const [createPage, setCreatePage] = React.useState(false);

  React.useEffect(() => {
    let createPage = searchParams.get("create") !== null;

    setCreatePage(createPage);
  }, [searchParams]);

  return (
    <DefaultLayout>
      {createPage ? (
        <CreateSetForm />
      ) : (
        <>
          <ContentAreaHeader>
            <SpacedBetweenArea>
              <WidgetLabel>{i18n.dynamic_sets}</WidgetLabel>
              <Button variant="transparent_aqua_blue_1">
                <Link href={`${paths.dynamic_sets}?create`}>
                  <AiFillPlusCircle />
                  <span>{i18n.create_dynamic_set.toUpperCase()}</span>
                </Link>
              </Button>
            </SpacedBetweenArea>
          </ContentAreaHeader>

          <ContentAreaBody>
            <ContentAreaRow>
              <PaddedTableWrapper>
                <SetTable setType="Dynamic" />
              </PaddedTableWrapper>
            </ContentAreaRow>
          </ContentAreaBody>
        </>
      )}
    </DefaultLayout>
  );
};

export default DynamicSets;
