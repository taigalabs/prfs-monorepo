import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";

import styles from "./CreatePoll.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { TopWidgetTitle, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import FormTextInput from "@/components/form/FormTextInput";
import { paths } from "@/paths";
import FormTextareaInput from "@/components/form/FormTextareaInput";
import { ContentAreaRow } from "@/components/content_area/ContentArea";
import { useAppSelector } from "@/state/hooks";

const CreatePollForm: React.FC<CreatePollFormProps> = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const localPrfsAccount = useAppSelector(state => state.user.localPrfsAccount);

  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [errMsg, setErrMsg] = React.useState("");

  const handleChangeName = React.useCallback(
    (ev: any) => {
      setName(ev.target.value);
    },
    [setName]
  );

  const handleChangeDesc = React.useCallback(
    (ev: any) => {
      setDesc(ev.target.value);
    },
    [setDesc]
  );

  const handleClickCreatePoll = React.useCallback(() => {}, []);

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

      <ContentAreaRow>
        <Widget>
          <WidgetPaddedBody>
            <div className={styles.desc}>{i18n.create_poll_subtitle}</div>
            <div className={styles.textInputContainer}>
              <FormTextInput label={i18n.label} handleChange={handleChangeName} />
            </div>
            <div className={styles.textInputContainer}>
              <FormTextareaInput
                label={i18n.description}
                handleChange={handleChangeDesc}
                rows={4}
              />
            </div>
          </WidgetPaddedBody>
        </Widget>
      </ContentAreaRow>

      <WidgetPaddedBody>
        <div className={styles.errMsg} style={{ opacity: errMsg.length > 0 ? 1 : 0 }}>
          {errMsg}
        </div>

        <Button variant="aqua_blue_1" handleClick={handleClickCreatePoll}>
          {i18n.create_poll}
        </Button>
      </WidgetPaddedBody>
    </div>
  );
};

export default CreatePollForm;

export interface CreatePollFormProps {}
