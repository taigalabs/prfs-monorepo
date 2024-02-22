"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { shyApi } from "@taigalabs/prfs-api-js";

import styles from "./Home.module.scss";
import LeftBar from "@/components/left_bar/LeftBar";
import { DefaultHeader, DefaultMain } from "@/components/layouts/default_layout/DefaultLayout";
import LeftBarDrawer from "@/components/left_bar/LeftBarDrawer";
import { useSignedInUser } from "@/hooks/user";
import { paths } from "@/paths";
import Loading from "@/components/loading/Loading";
import ChannelList from "@/components/channel_list/ChannelList";
import GlobalHeader from "@/components/global_header/GlobalHeader";

function useShyChannels(offset: number) {
  return useQuery({
    queryKey: ["get_shy_chanells", offset],
    queryFn: async () => {
      const data = await shyApi("get_shy_channels", { offset });
      return data.payload ? data.payload.shy_channels : null;
    },
    enabled: offset !== undefined,
  });
}

const Home: React.FC<HomeProps> = () => {
  const router = useRouter();
  const [isLeftBarDrawerVisible, setIsLeftBarDrawerVisible] = React.useState(false);
  const { status, data, error, isFetching } = useShyChannels(0);
  const handleClickShowLeftBarDrawer = React.useCallback(
    (open?: boolean) => {
      if (open !== undefined) {
        setIsLeftBarDrawerVisible(!!open);
      } else {
        setIsLeftBarDrawerVisible(v => !v);
      }
    },
    [setIsLeftBarDrawerVisible],
  );

  const { isInitialized, shyCredential } = useSignedInUser();
  React.useEffect(() => {
    if (isInitialized) {
      if (shyCredential === null) {
        router.push(paths.account__sign_in);
      }
    }
  }, [isInitialized, shyCredential, router]);

  return isInitialized && shyCredential ? (
    <div className={styles.wrapper}>
      <GlobalHeader />
      <DefaultHeader>
        <div className={styles.leftBarContainer}>
          <LeftBar credential={shyCredential} channels={data ?? null} />
        </div>
        <LeftBarDrawer isOpen={isLeftBarDrawerVisible} setIsOpen={handleClickShowLeftBarDrawer}>
          <LeftBar credential={shyCredential} channels={data ?? null} />
        </LeftBarDrawer>
      </DefaultHeader>
      <DefaultMain>
        <ChannelList
          credential={shyCredential}
          handleClickShowLeftBarDrawer={handleClickShowLeftBarDrawer as any}
        />
      </DefaultMain>
    </div>
  ) : (
    <Loading />
  );
};

export default Home;

export interface HomeProps {}
