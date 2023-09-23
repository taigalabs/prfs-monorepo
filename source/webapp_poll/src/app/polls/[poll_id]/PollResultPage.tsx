"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import SocialSharePopover from "@taigalabs/prfs-react-components/src/social_share_popover/SocialSharePopover";

import styles from "./PollPage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import ContentArea, { TopPlaceholder } from "@/components/content_area/ContentArea";
import Link from "next/link";
import Masthead from "@/components/masthead/Masthead";
import { useQuery } from "@tanstack/react-query";
import PollResultView from "@/components/poll_result_view/PollResultView";

const PollResultPage: React.FC<PollResultPageProps> = ({ pollId }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  const { isLoading, data } = useQuery({
    queryKey: ["get_prfs_poll_by_poll_id"],
    queryFn: async () => {
      const { payload } = await prfsApi2("get_prfs_poll_result_by_poll_id", { poll_id: pollId });
      return payload;
    },
  });

  const headerLabel = `${i18n.poll_result} ${pollId}`;

  return (
    <DefaultLayout>
      <Masthead />
      <ContentArea>
        <TopPlaceholder />
        <div className={styles.container}>
          {isLoading ? (
            <>Loading...</>
          ) : (
            <div className={styles.inner}>
              <div className={styles.header}>
                <div className={styles.row}>
                  <Link href={paths.__}>
                    <ArrowButton variant="left" />
                  </Link>
                  <p className={styles.headerLabel}>{headerLabel}</p>
                </div>
                <div className={styles.buttonRow}>
                  <div>
                    <Button variant="transparent_aqua_blue_1">
                      <span>{i18n.view_result.toUpperCase()}</span>
                    </Button>
                  </div>
                  <div className={styles.rightBtnGroup}>
                    <Button variant="transparent_aqua_blue_1">
                      <AiOutlineCopy />
                      <span>{i18n.copy_url.toUpperCase()}</span>
                    </Button>
                    <SocialSharePopover />
                  </div>
                </div>
              </div>
              <div className={styles.content}>
                <div className={styles.proofDetailContainer}>
                  {data?.prfs_poll_responses && (
                    <PollResultView poll_responses={data.prfs_poll_responses} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </ContentArea>
    </DefaultLayout>
  );
};

export default PollResultPage;

export interface PollResultPageProps {
  pollId: string;
}
