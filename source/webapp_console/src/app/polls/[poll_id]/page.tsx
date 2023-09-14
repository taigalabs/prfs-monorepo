"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import Link from "next/link";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";

import styles from "./PollPage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import { paths } from "@/paths";
import SocialSharePopover from "@/components/social_share_popover/SocialSharePopover";
import { ContentAreaHeader, ContentAreaRow } from "@/components/content_area/ContentArea";
import { SpacedBetweenArea } from "@/components/area/Area";
import { useAppDispatch } from "@/state/hooks";
import { useQuery } from "@tanstack/react-query";
import PollDetailTable from "@/components/poll_detail_table/PollDetailTable";

const PollPage: React.FC<PollPageProps> = ({ params }) => {
  let i18n = React.useContext(i18nContext);
  const router = useRouter();

  const dispatch = useAppDispatch();
  useLocalWallet(dispatch);

  const pollId = decodeURIComponent(params.poll_id);
  const topWidgetLabel = `${i18n.polls} ${params.poll_id}`;

  const { isLoading, data } = useQuery({
    queryKey: ["get_prfs_proof_instances"],
    queryFn: async () => {
      const { payload } = await prfsApi2("get_prfs_poll_by_poll_id", { poll_id: pollId });
      return payload;
    },
  });

  return (
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

      {isLoading ? (
        <>Loading...</>
      ) : (
        <ContentAreaRow>
          <div className={styles.singleColRow}>
            <div className={styles.tableContainer}>
              <PollDetailTable poll={data!.prfs_poll} />
            </div>
          </div>

          {/* <div className={styles.singleColRow}> */}
          {/*   <div className={styles.tableContainer}> */}
          {/*     <div className={styles.title}> */}
          {/*       {i18n.proof} ({proofInstance.proof.length} bytes) */}
          {/*     </div> */}
          {/*     <ProofView proof={proofInstance.proof} /> */}
          {/*   </div> */}
          {/* </div> */}
        </ContentAreaRow>
      )}
    </DefaultLayout>
  );
};

export default PollPage;

interface PollPageProps {
  params: {
    poll_id: string;
  };
}
