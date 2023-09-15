"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import ProofBanner from "@taigalabs/prfs-react-components/src/proof_banner/ProofBanner";
import SocialSharePopover from "@taigalabs/prfs-react-components/src/social_share_popover/SocialSharePopover";

import styles from "./ProofInstancePage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
// import LeftBar from "@/components/left_bar/LeftBar";
import ContentArea, { TopPlaceholder } from "@/components/content_area/ContentArea";
import { envs } from "@/envs";
import ProofDetailView from "@/components/proof_detail_view/ProofDetailView";
import Link from "next/link";
import Masthead from "@/components/masthead/Masthead";
import { PrfsPoll } from "@taigalabs/prfs-entities/bindings/PrfsPoll";

const PollPage: React.FC<PollPageProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  const [proofInstance, setProofInstance] = React.useState<PrfsPoll>();
  React.useEffect(() => {
    async function fn() {
      const poll_id = decodeURIComponent(params.poll_id);
      try {
        const { payload } = await prfsApi2("get_prfs_poll_by_poll_id", {
          poll_id,
        });

        setProofInstance(payload.prfs_poll);
      } catch (err) {
        console.error("Proof instance is not found, invalid access");
      }
    }

    fn().then();
  }, [setProofInstance]);

  const headerLabel = `${i18n.proof_instance} ${params.poll_id}`;

  return (
    <DefaultLayout>
      <Masthead />
      <ContentArea>
        <TopPlaceholder />
        <div className={styles.container}>
          {proofInstance ? (
            <div className={styles.inner}>
              <div className={styles.header}>
                <div className={styles.row}>
                  <Link href={paths.polls}>
                    <ArrowButton variant="left" />
                  </Link>
                  <p className={styles.headerLabel}>{headerLabel}</p>
                </div>
                <div className={styles.buttonRow}>
                  <Button variant="transparent_aqua_blue_1">
                    <AiOutlineCopy />
                    <span>{i18n.copy_url.toUpperCase()}</span>
                  </Button>
                  <SocialSharePopover />
                </div>
              </div>
              <div className={styles.content}>
                <div className={styles.proofDetailContainer}>
                  {/* <ProofDetailView proofInstance={proofInstance} /> */}
                </div>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </ContentArea>
    </DefaultLayout>
  );
};

export default PollPage;

interface PollPageProps {
  params: {
    poll_id: string;
  };
}
