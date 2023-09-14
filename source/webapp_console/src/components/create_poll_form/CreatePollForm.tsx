import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { useMutation } from "@tanstack/react-query";
import SelectProofTypeDialog from "@taigalabs/prfs-react-components/src/select_proof_type_dialog/SelectProofTypeDialog";

import styles from "./CreatePoll.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { TopWidgetTitle, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import FormTextInput from "@/components/form/FormTextInput";
import { paths } from "@/paths";
import FormTextareaInput from "@/components/form/FormTextareaInput";
import { ContentAreaRow } from "@/components/content_area/ContentArea";
import { useAppSelector } from "@/state/hooks";
import { CreatePrfsPollRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsPollRequest";
import { ProofTypeItem } from "@taigalabs/prfs-react-components/src/select_proof_type_dialog/ProofTypeTable";

const CreatePollForm: React.FC<CreatePollFormProps> = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const localPrfsAccount = useAppSelector(state => state.user.localPrfsAccount);

  const [formData, setFormData] = React.useState<CreatePollFormData>({
    plural_voting: "single",
  });
  const [errMsg, setErrMsg] = React.useState("");

  const handleChangeFormData = React.useCallback(
    (ev: any) => {
      setFormData(oldState => {
        if (oldState) {
          return {
            ...oldState,
            [ev.target.name]: ev.target.value,
          };
        } else {
          return {
            [ev.target.name]: ev.target.value,
          };
        }
      });
    },
    [setFormData]
  );

  const mutation = useMutation({
    mutationFn: (req: CreatePrfsPollRequest) => {
      return prfsApi2("create_prfs_poll", req);
    },
  });

  const handleSelectProofType = React.useCallback(
    (proofTypeItem: ProofTypeItem) => {
      setFormData(oldState => {
        return { ...oldState, ["proof_type_id"]: proofTypeItem.proofTypeId };
      });
    },
    [setFormData]
  );

  const handleClickCreatePoll = React.useCallback(async () => {
    if (formData) {
      if (formData.label && formData.plural_voting && formData.proof_type_id && localPrfsAccount) {
        const poll_id = uuidv4();
        const { account_id } = localPrfsAccount.prfsAccount;

        await mutation.mutateAsync({
          poll_id,
          plural_voting: formData.plural_voting === "plural",
          label: formData.label,
          proof_type_id: formData.proof_type_id,
          author: account_id,
        });

        router.push(paths.polls);
      }
    }
  }, [formData, localPrfsAccount, mutation, router]);

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
              <FormTextInput label={i18n.label} name="label" handleChange={handleChangeFormData} />
            </div>
            <div className={styles.textInputContainer}>
              <FormTextareaInput
                name="desc"
                label={i18n.description}
                handleChange={handleChangeFormData}
                rows={4}
              />
            </div>
            <div className={styles.textInputContainer}>
              <div className={styles.inputLabel}>{i18n.choose_proof_type}</div>
              <SelectProofTypeDialog handleSelectProofType={handleSelectProofType} />
            </div>
            <div className={styles.textInputContainer}>
              <div className={styles.inputLabel}>{i18n.choose_plural_voting}</div>
              <div className={styles.radioGroup} onChange={handleChangeFormData}>
                <label>
                  <input type="radio" value="single" name="plural_voting" defaultChecked />
                  <span>{i18n.single}</span>
                </label>
                <label>
                  <input type="radio" value="plural" name="plural_voting" />
                  <span>{i18n.plural}</span>
                </label>
              </div>
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

interface CreatePollFormData {
  label?: string;
  plural_voting?: string;
  proof_type_id?: string;
}
