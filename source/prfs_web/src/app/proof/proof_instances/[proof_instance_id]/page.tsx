"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as prfsApi from "@taigalabs/prfs-api-js";
import Link from "next/link";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import Head from "next/head";
import { AiOutlineCopy } from "react-icons/ai";

import styles from "./ProofInstancePage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { TopWidgetTitle, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import ProofInstanceDetailTable from "@/components/proof_instance_detail_table/ProofInstanceDetailTable";
import ProofInstanceQRCode from "@/components/proof_instance_qrcode/ProofInstanceQRCode";
import { paths } from "@/paths";
import ProofImage from "@/components/proof_image/ProofImage";
import SocialSharePopover from "@/components/social_share_popover/SocialSharePopover";
import { ContentAreaHeader, ContentAreaRow } from "@/components/content_area/ContentArea";
import PublicInputsView from "@/components/public_inputs_view/PublicInputsView";
import { SpacedBetweenArea } from "@/components/area/Area";
import ProofView from "@/components/proof_view/ProofView";
import ProofBanner from "@/components/proof_banner/ProofBanner";

const ProofInstancePage: React.FC<ProofInstancePageProps> = ({ params }) => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);
  const router = useRouter();

  useLocalWallet(dispatch);

  const topWidgetLabel = `${i18n.proof_instance} ${params.proof_instance_id}`;

  const [proofInstance, setProofInstance] = React.useState<PrfsProofInstanceSyn1>();
  React.useEffect(() => {
    async function fn() {
      const proof_instance_id = decodeURIComponent(params.proof_instance_id);
      try {
        let { payload } = await prfsApi.getPrfsProofInstances({
          page: 0,
          proof_instance_id,
        });

        const { prfs_proof_instances_syn1 } = payload;
        setProofInstance(prfs_proof_instances_syn1[0]);
      } catch (err) {
        console.error("Proof instance is not found, invalid access");
        // router.push(paths.proof__proof_instances);
      }
    }

    fn().then();
  }, [setProofInstance]);

  return (
    proofInstance && (
      <DefaultLayout>
        <ContentAreaHeader>
          <SpacedBetweenArea>
            <div className={styles.navigation}>
              <Link href={paths.proof__proof_instances}>
                <ArrowButton variant="left" />
              </Link>
              <WidgetLabel>{topWidgetLabel}</WidgetLabel>
            </div>
            <div className={styles.headerRight}>
              <SocialSharePopover />
            </div>
          </SpacedBetweenArea>
        </ContentAreaHeader>

        <ContentAreaRow>
          <Widget>
            <div className={styles.singleColRow}>
              <ProofBanner proofInstance={proofInstance} />
            </div>

            <div className={styles.singleColRow}>
              <div className={styles.tableContainer}>
                <ProofInstanceDetailTable proofInstance={proofInstance} />
              </div>
            </div>

            <div className={styles.singleColRow}>
              <div className={styles.tableContainer}>
                <div className={styles.title}>{i18n.public_inputs}</div>
                <PublicInputsView publicInputs={proofInstance.public_inputs} />
              </div>
            </div>

            <div className={styles.singleColRow}>
              <div className={styles.tableContainer}>
                <div className={styles.title}>{i18n.proof}</div>
                <ProofView proof={proofInstance.proof} />
              </div>
            </div>
          </Widget>
        </ContentAreaRow>
      </DefaultLayout>
    )
  );
};

export default ProofInstancePage;

interface ProofInstancePageProps {
  params: {
    proof_instance_id: string;
  };
}
