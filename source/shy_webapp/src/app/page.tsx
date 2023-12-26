import React, { Suspense } from "react";

import styles from "./HomePage.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import { ContentLeft, ContentMain } from "@/components/content_area/ContentArea";
import LeftBar from "@/components/left_bar/LeftBar";
import TimelineFeeds2 from "@/components/timeline_feeds2/TimelineFeeds2";
import Home from "@/components/home/Home";

const HomePage: React.FC = () => {
  return (
    <DefaultLayout>
      <Home />
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
    </DefaultLayout>
  );
};

export default HomePage;
