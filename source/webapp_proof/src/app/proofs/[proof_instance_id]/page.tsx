"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import ProofBanner from "@taigalabs/prfs-react-components/src/proof_banner/ProofBanner";
import SocialSharePopover from "@taigalabs/prfs-react-components/src/social_share_popover/SocialSharePopover";
import { HiOutlineDesktopComputer } from "@react-icons/all-files/hi/HiOutlineDesktopComputer";
import Link from "next/link";
import { useMutation } from "wagmi";
import { GetPrfsProofInstanceByInstanceIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstanceByInstanceIdRequest";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";

import styles from "./page.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import DefaultLayout, { DefaultBody } from "@/layouts/default_layout/DefaultLayout";
import { TopPlaceholder } from "@/components/content_area/ContentArea";
import { envs } from "@/envs";
import ProofDetailView from "@/components/proof_detail_view/ProofDetailView";
import Masthead from "@/components/masthead/Masthead";
import Tutorial from "@/components/tutorial/Tutorial";
import TutorialStepper from "@/components/tutorial/TutorialStepper";

const ProofInstancePage: React.FC<ProofInstancePageProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const [consoleUrl, setConsoleUrl] = React.useState("");

  const { mutateAsync: getPrfsProofInstanceByInstanceIdRequest } = useMutation({
    mutationFn: (req: GetPrfsProofInstanceByInstanceIdRequest) => {
      return prfsApi2("get_prfs_proof_instance_by_instance_id", req);
    },
  });

  const [proofInstance, setProofInstance] = React.useState<PrfsProofInstanceSyn1>();
  React.useEffect(() => {
    async function fn() {
      const proof_instance_id = decodeURIComponent(params.proof_instance_id);
      try {
        const { payload } = await getPrfsProofInstanceByInstanceIdRequest({
          proof_instance_id,
        });

        setProofInstance(payload.prfs_proof_instance_syn1);

        const url = `${process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/proof_instances/${proof_instance_id}`;
        setConsoleUrl(url);
      } catch (err) {
        console.error("Proof instance is not found, invalid access");
      }
    }

    fn().then();
  }, [setProofInstance, getPrfsProofInstanceByInstanceIdRequest, setConsoleUrl]);

  // const headerLabel = `${i18n.proof_instance} ${params.proof_instance_id}`;

  return (
    <DefaultLayout>
      <Masthead />
      <DefaultBody>
        <TopPlaceholder />
        <div className={styles.container}>
          <Tutorial />
          {proofInstance ? (
            <ProofDetailView proofInstance={proofInstance} />
          ) : (
            <div className={styles.loading}>Loading...</div>
          )}
        </div>
      </DefaultBody>
    </DefaultLayout>
  );
};

export default ProofInstancePage;

interface ProofInstancePageProps {
  params: {
    proof_instance_id: string;
  };
}
