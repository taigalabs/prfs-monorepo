"use client";

import React from "react";

import styles from "./HomePage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import ContentArea from "@/components/content_area/ContentArea";
import Masthead from "@/components/masthead/Masthead";
import PollFeeds from "@/components/poll_feeds/PollFeeds";

const HomePage: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <DefaultLayout>
      <Masthead />
      <ContentArea>
        <div className={styles.container}>
          <PollFeeds />
        </div>
      </ContentArea>
    </DefaultLayout>
  );
};

export default HomePage;
