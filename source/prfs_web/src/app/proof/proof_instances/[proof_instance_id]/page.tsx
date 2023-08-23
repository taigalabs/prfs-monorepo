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

const URLView: React.FC<URLViewProps> = ({ shortId }) => {
  let i18n = React.useContext(i18nContext);

  const url = `${process.env.NEXT_PUBLIC_PRFS_WEB_ENDPOINT}/p/${shortId}`;
  const handleClickCopy = React.useCallback(() => {
    navigator.clipboard.writeText(url);
  }, [url]);

  return (
    <div className={styles.urlView}>
      <p className={styles.label}>{i18n.url}</p>
      <div className={styles.value}>
        <span>{url}</span>
        <button onClick={handleClickCopy}>
          <AiOutlineCopy />
        </button>
      </div>
    </div>
  );
};

const ProofView: React.FC<ProofViewProps> = ({ proof }) => {
  let i18n = React.useContext(i18nContext);

  const proofElem = React.useMemo(() => {
    const a = Buffer.from(proof).toString("hex");

    return a;
  }, [proof]);

  return (
    <div className={styles.proofView}>
      <div className={styles.label}>{i18n.proof}</div>
      <div className={styles.value}>{proofElem}</div>
    </div>
  );
};

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
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap"
            rel="stylesheet"
          />
        </Head>

        <ContentAreaHeader>
          <div className={styles.navigation}>
            <Link href={paths.proof__proof_instances}>
              <ArrowButton variant="left" />
            </Link>
          </div>
          <WidgetLabel>{topWidgetLabel}</WidgetLabel>
        </ContentAreaHeader>

        <ContentAreaRow>
          <Widget>
            <div className={styles.singleValueRow}>
              <div className={styles.summary}>
                <ProofImage src={proofInstance.img_url} />
                <div className={styles.expression}>{proofInstance.expression}</div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.proofInstanceDetailTableContainer}>
                <ProofInstanceDetailTable proofInstance={proofInstance} />
              </div>
              <div className={styles.right}>
                <ProofInstanceQRCode proofInstance={proofInstance} />
                <URLView shortId={proofInstance.short_id} />
                <SocialSharePopover />
              </div>
            </div>

            <div className={styles.singleValueRow}>
              <PublicInputsView publicInputs={proofInstance.public_inputs} />
            </div>

            <div className={styles.singleValueRow}>
              <ProofView proof={proofInstance.proof} />
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

interface ProofViewProps {
  proof: number[];
}

interface URLViewProps {
  shortId: string;
}
