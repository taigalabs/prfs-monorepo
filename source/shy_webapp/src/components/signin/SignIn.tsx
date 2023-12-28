"use client";

import React, { Suspense } from "react";

import styles from "./Home.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { ContentLeft, ContentMain } from "@/components/content_area/ContentArea";
import LeftBar from "@/components/left_bar/LeftBar";
import TimelineFeeds2 from "@/components/timeline_feeds2/TimelineFeeds2";

const SignIn: React.FC<SignInProps> = () => {
  return (
    <div className={styles.wrapper}>
      sign in
      {/* <ContentLeft> */}
      {/*   <Suspense> */}
      {/*     <LeftBar /> */}
      {/*   </Suspense> */}
      {/* </ContentLeft> */}
      {/* <ContentMain> */}
      {/*   <div className={styles.container}> */}
      {/*     <Suspense> */}
      {/*       <TimelineFeeds2 channelId="default" /> */}
      {/*     </Suspense> */}
      {/*   </div> */}
      {/* </ContentMain> */}
    </div>
  );
};

export default SignIn;

export interface SignInProps {}
