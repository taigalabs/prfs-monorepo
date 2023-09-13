"use client";

import React from "react";

import styles from "./ProofsPage.module.scss";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import Masthead from "@/components/masthead/Masthead";
import ContentArea from "@/components/content_area/ContentArea";
import ProofFeeds from "@/components/proof_feeds/ProofFeeds";

const ProofsPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Masthead />
      <ContentArea>
        <div className={styles.wrapper}>
          <ProofFeeds />
        </div>
      </ContentArea>
    </DefaultLayout>
  );
};

export default ProofsPage;
