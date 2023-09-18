import React from "react";
import { useRouter } from "next/navigation";

import styles from "./HomeTimelineFeeds.module.scss";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import ContentArea from "@/components/content_area/ContentArea";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import Masthead from "@/components/masthead/Masthead";
import LeftBar from "@/components/left_bar/LeftBar";

const HomeTimelineFeeds: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>home timeline feeds</div>
  );
};

export default HomeTimelineFeeds;
