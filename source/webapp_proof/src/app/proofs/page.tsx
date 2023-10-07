"use client";

import React from "react";

import styles from "./ProofsPage.module.scss";
import DefaultLayout, { DefaultBody } from "@/layouts/default_layout/DefaultLayout";
import Masthead from "@/components/masthead/Masthead";
import ProofFeeds from "@/components/proof_feeds/ProofFeeds";

const ProofsPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Masthead />
      <DefaultBody>
        <div className={styles.feedContainer}>
          <ProofFeeds />
        </div>
      </DefaultBody>
    </DefaultLayout>
  );
};

export default ProofsPage;
