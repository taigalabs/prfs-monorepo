import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";

import styles from "./CreateDynamicSetElement.module.scss";
import { i18nContext } from "@/i18n/context";
import Widget, { TopWidgetTitle, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import FormTextInput from "@/components/form/FormTextInput";
import { paths } from "@/paths";
import { ContentAreaRow } from "../content_area/ContentArea";
import { useAppSelector } from "@/state/hooks";

export const CreateDynamicSetElement: React.FC<CreateDynamicSetElementProps> = ({ setId }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const localPrfsAccount = useAppSelector(state => state.user.localPrfsAccount);

  const [value, setValue] = React.useState("");
  const [meta, setMeta] = React.useState("");
  const [errMsg, setErrMsg] = React.useState("");

  const handleChangeValue = React.useCallback(
    (ev: any) => {
      setValue(ev.target.value);
    },
    [setValue],
  );

  const handleChangeMeta = React.useCallback(
    (ev: any) => {
      setMeta(ev.target.value);
    },
    [setMeta],
  );

  const handleClickCreateSetElement = React.useCallback(async () => {
    if (!localPrfsAccount) {
      setErrMsg("User is not signed in");
      return;
    }

    const { prfsAccount } = localPrfsAccount;

    if (!prfsAccount) {
      setErrMsg("Invalid local prfs account");
      return null;
    }

    if (value.length < 1) {
      setErrMsg("Value should be defined");
      return;
    }

    setErrMsg("");

    let createDynamicSetElementRequest = {
      set_id: setId,
      val: value,
      meta,
    };

    try {
      await prfsApi2("create_prfs_dynamic_set_element", createDynamicSetElementRequest);

      router.push(`${paths.dynamic_sets}/${setId}`);
    } catch (err: any) {
      console.error(err);

      setErrMsg(err.toString());
    }
  }, [setErrMsg, value, meta, localPrfsAccount]);

  return (
    <div className={styles.wrapper}>
      <TopWidgetTitle>
        <div className={styles.header}>
          <Link href={`${paths.dynamic_sets}/${setId}`}>
            <ArrowButton variant="left" />
          </Link>
          <WidgetLabel>
            {i18n.create_set_element} for {setId}
          </WidgetLabel>
        </div>
      </TopWidgetTitle>

      <ContentAreaRow>
        <Widget>
          <WidgetPaddedBody>
            <div className={styles.desc}>{i18n.create_dynamic_set_element_subtitle}</div>
            <div className={styles.textInputContainer}>
              <FormTextInput label={i18n.value} name="value" handleChange={handleChangeValue} />
            </div>
            <div className={styles.textInputContainer}>
              <FormTextInput label={i18n.meta} name="meta" handleChange={handleChangeMeta} />
            </div>
          </WidgetPaddedBody>
        </Widget>
      </ContentAreaRow>

      <WidgetPaddedBody>
        <div className={styles.errMsg} style={{ opacity: errMsg.length > 0 ? 1 : 0 }}>
          {errMsg}
        </div>

        <Button variant="aqua_blue_1" handleClick={handleClickCreateSetElement}>
          {i18n.create_set_element}
        </Button>
      </WidgetPaddedBody>
    </div>
  );
};

export interface CreateDynamicSetElementProps {
  setId: string;
}
