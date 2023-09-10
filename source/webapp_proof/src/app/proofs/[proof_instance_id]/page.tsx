"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import ProofBanner from "@taigalabs/prfs-react-components/src/proof_banner/ProofBanner";

import styles from "./ProofInstancePage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import Masthead from "@/components/masthead/Masthead";
import ContentArea from "@/components/content_area/ContentArea";
import { envs } from "@/envs";

const ProofInstancePage: React.FC<ProofInstancePageProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  const [proofInstance, setProofInstance] = React.useState<PrfsProofInstanceSyn1>();
  React.useEffect(() => {
    async function fn() {
      const proof_instance_id = decodeURIComponent(params.proof_instance_id);
      try {
        const { payload } = await prfsApi2("get_prfs_proof_instance_by_instance_id", {
          proof_instance_id,
        });

        setProofInstance(payload.prfs_proof_instance_syn1);
      } catch (err) {
        console.error("Proof instance is not found, invalid access");
      }
    }

    fn().then();
  }, [setProofInstance]);

  return (
    <DefaultLayout>
      <Masthead />
      <ContentArea>
        <div className={styles.container}>
          {proofInstance && (
            <ProofBanner
              proofInstance={proofInstance}
              webappConsoleEndpoint={envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}
            />
          )}
        </div>
      </ContentArea>
    </DefaultLayout>
  );
};

export default ProofInstancePage;

interface ProofInstancePageProps {
  params: {
    proof_instance_id: string;
  };
}
