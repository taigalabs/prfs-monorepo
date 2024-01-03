"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import Link from "next/link";
import ArrowButton from "@taigalabs/prfs-react-lib/src/arrow_button/ArrowButton";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";

import styles from "./ProofInstancePage.module.scss";
import { i18nContext } from "@/i18n/context";
import { WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import ProofInstanceDetailTable from "@/components/proof_instance_detail_table/ProofInstanceDetailTable";
import { paths } from "@/paths";
import SocialSharePopover from "@/components/social_share_popover/SocialSharePopover";
import { ContentAreaHeader, ContentAreaRow } from "@/components/content_area/ContentArea";
import PublicInputTable from "@/components/public_input_table/PublicInputTable";
import { SpacedBetweenArea } from "@/components/area/Area";
import ProofView from "@/components/proof_view/ProofView";
import ProofBanner from "@taigalabs/prfs-react-lib/src/proof_banner/ProofBanner";
import { useAppDispatch } from "@/state/hooks";
import { envs } from "@/envs";

const ProofInstancePage: React.FC<ProofInstancePageProps> = ({ params }) => {
  let i18n = React.useContext(i18nContext);
  const router = useRouter();

  const dispatch = useAppDispatch();
  useLocalWallet(dispatch);

  const topWidgetLabel = `${i18n.proof_instance} ${params.proof_instance_id}`;

  const [proofInstance, setProofInstance] = React.useState<PrfsProofInstanceSyn1>();
  React.useEffect(() => {
    async function fn() {
      const proof_instance_id = decodeURIComponent(params.proof_instance_id);
      try {
        const { payload } = await prfsApi2("get_prfs_proof_instance_by_instance_id", {
          proof_instance_id,
        });

        if (payload) {
          setProofInstance(payload.prfs_proof_instance_syn1);
        }
      } catch (err) {
        console.error("Proof instance is not found, invalid access");
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
              <Link href={paths.proof_instances}>
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
          <div className={styles.singleColRow}>
            <ProofBanner
              proofInstance={proofInstance}
              webappProofEndpoint={envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}
            />
          </div>

          <div className={styles.singleColRow}>
            <div className={styles.tableContainer}>
              <ProofInstanceDetailTable proofInstance={proofInstance} />
            </div>
          </div>

          <div className={styles.singleColRow}>
            <div className={styles.tableContainer}>
              <div className={styles.title}>{i18n.public_inputs}</div>
              <PublicInputTable publicInputs={proofInstance.public_inputs} />
            </div>
          </div>

          <div className={styles.singleColRow}>
            <div className={styles.tableContainer}>
              <div className={styles.title}>
                {i18n.proof} ({proofInstance.proof.length} bytes)
              </div>
              <ProofView proof={proofInstance.proof} />
            </div>
          </div>
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
