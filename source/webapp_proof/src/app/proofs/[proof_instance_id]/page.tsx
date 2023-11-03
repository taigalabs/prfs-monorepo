"use client";

import React from "react";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { useMutation } from "wagmi";
import { GetPrfsProofInstanceByInstanceIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstanceByInstanceIdRequest";

import styles from "./page.module.scss";
import { i18nContext } from "@/contexts/i18n";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import { TopPlaceholder } from "@/components/content_area/ContentArea";
import ProofDetailView from "@/components/proof_detail_view/ProofDetailView";
import Masthead from "@/components/masthead/Masthead";
import Tutorial from "@/components/tutorial/Tutorial";
import TutorialStepper from "@/components/tutorial/TutorialStepper";

const ProofInstancePage: React.FC<ProofInstancePageProps> = ({ params }) => {
  // const { mutateAsync: getPrfsProofInstanceByInstanceIdRequest } = useMutation({
  //   mutationFn: (req: GetPrfsProofInstanceByInstanceIdRequest) => {
  //     return prfsApi2("get_prfs_proof_instance_by_instance_id", req);
  //   },
  // });

  // const [proofInstance, setProofInstance] = React.useState<PrfsProofInstanceSyn1>();
  // React.useEffect(() => {
  //   async function fn() {
  //     const proof_instance_id = decodeURIComponent(params.proof_instance_id);
  //     try {
  //       const { payload } = await getPrfsProofInstanceByInstanceIdRequest({
  //         proof_instance_id,
  //       });

  //       setProofInstance(payload.prfs_proof_instance_syn1);
  //     } catch (err) {
  //       console.error("Proof instance is not found, invalid access");
  //     }
  //   }

  //   fn().then();
  // }, [setProofInstance, getPrfsProofInstanceByInstanceIdRequest]);

  return (
    <DefaultLayout>
      <Masthead />
      <DefaultBody>
        <TopPlaceholder />
        <div className={styles.container}>
          <Tutorial />
          <ProofDetailView proofInstanceId={params.proof_instance_id} />
        </div>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default ProofInstancePage;

interface ProofInstancePageProps {
  params: {
    proof_instance_id: string;
  };
}
