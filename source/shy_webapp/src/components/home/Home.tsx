"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import styles from "./Home.module.scss";
import LeftBar from "@/components/left_bar/LeftBar";
import { DefaultHeader, DefaultMain } from "@/components/layouts/default_layout/DefaultLayout";
import LeftBarDrawer from "@/components/left_bar/LeftBarDrawer";
import { useSignedInUser } from "@/hooks/user";
import { paths } from "@/paths";
import Loading from "@/components/loading/Loading";
import ChannelList from "@/components/channel_list/ChannelList";
import { prfsApi2 } from "@taigalabs/prfs-api-js";

function useChannelList(postId) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => prfsApi2("", postId),
    enabled: !!postId,
  });
}

const Home: React.FC<HomeProps> = () => {
  const router = useRouter();
  const [isLeftBarDrawerVisible, setIsLeftBarDrawerVisible] = React.useState(false);
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
      <DefaultHeader>
        <div className={styles.leftBarContainer}>
          <LeftBar credential={shyCredential} />
        </div>
        <LeftBarDrawer isOpen={isLeftBarDrawerVisible} setIsOpen={handleClickShowLeftBarDrawer}>
          <LeftBar credential={shyCredential} />
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
