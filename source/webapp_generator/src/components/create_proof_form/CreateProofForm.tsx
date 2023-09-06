import React from "react";
import { useRouter } from "next/navigation";

import styles from "./CreateProofForm.module.scss";
import { paths } from "@/paths";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import Masthead from "@/components/masthead/Masthead";
import ContentArea from "@/components/content_area/ContentArea";

const CreateProofForm: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  return <div className={styles.wrapper}></div>;
};

export default CreateProofForm;
