"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { HiDocumentAdd } from "@react-icons/all-files/hi/HiDocumentAdd";
import { Sigma } from "@phosphor-icons/react";

import styles from "./DynamicSet.module.scss";
// import { stateContext } from "@/contexts/state";
import { WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import SetElementTable from "@/components/set_element_table/SetElementTable";
import SetDetailTable from "@/components/set_detail_table/SetDetailTable";
import { paths } from "@/paths";
import { ContentAreaHeader, ContentAreaRow } from "@/components/content_area/ContentArea";
import { SpacedBetweenArea } from "@/components/area/Area";
import { CreateDynamicSetElement } from "@/components/create_dynamic_set_element/CreateDynamicSetElement";
import { useAppDispatch, useAppSelector } from "@/state/hooks";

const DynamicSet: React.FC<SetProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  // const { dispatch } = React.useContext(stateContext);
  const [createPage, setCreatePage] = React.useState(false);
  const [isComputingMerkleRoot, setIsComputingMerkleRoot] = React.useState(false);
  const dispatch = useAppDispatch();
  useLocalWallet(dispatch);

  const localPrfsAccount = useAppSelector(state => state.user.localPrfsAccount);

  const searchParams = useSearchParams();
  React.useEffect(() => {
    let createPage = searchParams.get("create") !== null;

    setCreatePage(createPage);
  }, [searchParams]);

  const [prfsSet, setPrfsSet] = React.useState<PrfsSet>();
  React.useEffect(() => {
    async function fn() {
      try {
        const { payload } = await prfsApi2("get_prfs_set_by_set_id", {
          set_id: params.set_id,
        });

        setPrfsSet(payload.prfs_set);
      } catch (err) {
        console.error(err);
      }
    }

    fn().then();
  }, [setPrfsSet]);

  const handleClickComputeMerkleRoot = React.useCallback(async () => {
    if (prfsSet && localPrfsAccount) {
      const { set_id } = prfsSet;
      const { prfsAccount } = localPrfsAccount;
      const { account_id } = prfsAccount;

      if (prfsAccount) {
        setIsComputingMerkleRoot(true);
        const { payload } = await prfsApi2("compute_prfs_set_merkle_root", {
          set_id,
          account_id,
        });

        console.log("Computed merkle root, %o", payload);
        setIsComputingMerkleRoot(false);
      }
    }
  }, [prfsSet, setIsComputingMerkleRoot, localPrfsAccount]);

  let setTableLabel = `${i18n.set} summary for ${params.set_id}`;

  return (
    <DefaultLayout>
      {createPage ? (
        <CreateDynamicSetElement setId={params.set_id} />
      ) : (
        <>
          <ContentAreaHeader>
            <SpacedBetweenArea>
              <div className={styles.navigation}>
                <Link href={paths.sets}>
                  <ArrowButton variant="left" />
                </Link>
                <WidgetLabel>{setTableLabel}</WidgetLabel>
              </div>
              <Button
                variant="transparent_aqua_blue_1"
                handleClick={handleClickComputeMerkleRoot}
                disabled={isComputingMerkleRoot}
              >
                <Sigma />
                <span>{i18n.compute_merkle_root.toUpperCase()}</span>
              </Button>
            </SpacedBetweenArea>
          </ContentAreaHeader>

          <div className={styles.contentBody}>
            <ContentAreaRow>
              <div className={styles.singleColRow}>
                <div className={styles.tableContainer}>
                  <SetDetailTable prfsSet={prfsSet} />
                </div>
              </div>
            </ContentAreaRow>

            <ContentAreaRow>
              <div className={styles.singleColRow}>
                <div className={styles.tableTitle}>{i18n.elements}</div>
                <ul className={styles.tableBtnRow}>
                  <li>
                    <Button variant="transparent_aqua_blue_1">
                      <Link href={`?create`}>
                        <HiDocumentAdd />
                        <span>{i18n.create.toUpperCase()}</span>
                      </Link>
                    </Button>
                  </li>
                </ul>
                <SetElementTable setId={params.set_id} prfsSet={prfsSet} editable />
              </div>
            </ContentAreaRow>
          </div>
        </>
      )}
    </DefaultLayout>
  );
};

export default DynamicSet;

interface SetProps {
  params: {
    set_id: string;
  };
}
