"use client";

import React from "react";
import { AiFillPlusCircle } from "@react-icons/all-files/ai/AiFillPlusCircle";
import { PaddedTableWrapper } from "@taigalabs/prfs-react-components/src/table2/Table2";

import styles from "./Sets.module.scss";
import { WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/i18n/context";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
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
import { useSearchParams } from "next/navigation";
import CreateSetForm from "@/components/create_set_form/CreateSetForm";
import { useAppDispatch } from "@/state/hooks";

const Sets: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  const dispatch = useAppDispatch();
  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <ContentAreaHeader>
        <SpacedBetweenArea>
          <WidgetLabel>{i18n.sets}</WidgetLabel>
          <Button variant="transparent_aqua_blue_1" disabled>
            <Link href={`${paths.sets}?create`}>
              <AiFillPlusCircle />
              <span>{i18n.create_set.toUpperCase()}</span>
            </Link>
          </Button>
        </SpacedBetweenArea>
      </ContentAreaHeader>

      <ContentAreaBody>
        <ContentAreaRow>
          <PaddedTableWrapper>
            <SetTable setType="Static" />
          </PaddedTableWrapper>
        </ContentAreaRow>
      </ContentAreaBody>
    </DefaultLayout>
  );
};

export default Sets;
