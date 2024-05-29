"use client";

import React from "react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";

import styles from "./CreateTopic.module.scss";
import GlobalHeader from "@/components/global_header/GlobalHeader";
import CreateTopicForm from "./CreateTopicForm";
import { useShyChannel } from "@/requests";
import Loading from "@/components/loading/Loading";

const CreateTopic: React.FC<EditorFooterProps> = ({ channelId, subChannelId }) => {
  const i18n = usePrfsI18N();
  const { data: channelData, isFetching: channelDataIsFetching, error } = useShyChannel(channelId);
  const channel = channelData?.payload?.shy_channel;

  return (
    <div className={styles.wrapper}>
      <GlobalHeader />
      {channelDataIsFetching && (
        <Loading>
          <Spinner />
        </Loading>
      )}
      {channel && <CreateTopicForm channel={channel} subChannelId={subChannelId} />}
    </div>
  );
};

export default CreateTopic;

export interface EditorFooterProps {
  channelId: string;
  subChannelId: string;
}
