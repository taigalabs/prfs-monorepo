import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import ArrowButton from "@taigalabs/prfs-react-lib/src/arrow_button/ArrowButton";

import styles from "./CreatePollPage.module.scss";
import { i18nContext } from "@/i18n/context";
import Widget, { TopWidgetTitle, WidgetLabel } from "@/components/widget/Widget";
import { paths } from "@/paths";
import { useAppSelector } from "@/state/hooks";
import CreatePollForm from "@/components/create_poll_form/CreatePollForm";

const CreatePollPage: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const localPrfsAccount = useAppSelector(state => state.user.localPrfsAccount);

  return (
    <div className={styles.wrapper}>
      <TopWidgetTitle>
        <div className={styles.header}>
          <Link href={paths.polls}>
            <ArrowButton variant="left" />
          </Link>
          <WidgetLabel>{i18n.create_poll}</WidgetLabel>
        </div>
      </TopWidgetTitle>

      <CreatePollForm />
    </div>
  );
};

export default CreatePollPage;
