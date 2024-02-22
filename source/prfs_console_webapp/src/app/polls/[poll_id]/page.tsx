"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import Link from "next/link";
import ArrowButton from "@taigalabs/prfs-react-lib/src/arrow_button/ArrowButton";

import styles from "./PollPage.module.scss";
import { i18nContext } from "@/i18n/context";
import { WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import { paths } from "@/paths";
import SocialSharePopover from "@/components/social_share_popover/SocialSharePopover";
import { ContentAreaHeader, ContentAreaRow } from "@/components/content_area/ContentArea";
import { SpacedBetweenArea } from "@/components/area/Area";
import { useAppDispatch } from "@/state/hooks";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import PollDetailTable from "@/components/poll_detail_table/PollDetailTable";
import CreatePollForm from "@/components/create_poll_form/CreatePollForm";

const PollPage: React.FC<PollPageProps> = ({ params }) => {
  let i18n = React.useContext(i18nContext);
  const router = useRouter();

  const dispatch = useAppDispatch();
  useLocalWallet(dispatch);

  const pollId = React.useMemo(() => {
    return decodeURIComponent(params.poll_id);
  }, [params]);
  const topWidgetLabel = `${i18n.poll} ${params.poll_id}`;

  const { isLoading, data } = useQuery({
    queryKey: ["get_prfs_poll_by_poll_id"],
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
            <Link href={paths.polls}>
              <ArrowButton variant="left" />
            </Link>
            <WidgetLabel>{topWidgetLabel}</WidgetLabel>
          </div>
          <div className={styles.headerRight}>
            <SocialSharePopover />
          </div>
        </SpacedBetweenArea>
      </ContentAreaHeader>

      {isLoading ? <>Loading...</> : <CreatePollForm poll={data!.prfs_poll} />}
    </DefaultLayout>
  );
};

export default PollPage;

interface PollPageProps {
  params: {
    poll_id: string;
  };
}
