import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { useMutation } from "@tanstack/react-query";
import SelectProofTypeDialog from "@taigalabs/prfs-react-components/src/select_proof_type_dialog/SelectProofTypeDialog";
import { ProofTypeItem } from "@taigalabs/prfs-react-components/src/select_proof_type_dialog/ProofTypeTable";
import { CreatePrfsPollRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsPollRequest";
import { PrfsPoll } from "@taigalabs/prfs-entities/bindings/PrfsPoll";

import styles from "./CreatePollPage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, {
  TopWidgetTitle,
  WidgetHeader,
  WidgetLabel,
  WidgetPaddedBody,
} from "@/components/widget/Widget";
import FormTextInput from "@/components/form/FormTextInput";
import { paths } from "@/paths";
import FormTextareaInput from "@/components/form/FormTextareaInput";
import { ContentAreaRow } from "@/components/content_area/ContentArea";
import { useAppSelector } from "@/state/hooks";
import QuestionBlock, { PollQuestion } from "@/components/create_poll_form/QuestionBlock";
import CreatePollForm from "@/components/create_poll_form/CreatePollForm";

const CreatePollPage: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const localPrfsAccount = useAppSelector(state => state.user.localPrfsAccount);

  // const [questions, setQuestions] = React.useState<PollQuestion[]>(
  //   (poll?.questions as PollQuestion[]) || [
  //     {
  //       type: "multiple_choice",
  //       label: "",
  //       required: true,
  //       choices: [
  //         {
  //           label: "",
  //         },
  //       ],
  //     },
  //   ]
  // );

  // const handleChangeQuestions = React.useCallback(
  //   (idx: number, ev: React.ChangeEvent) => {
  //     const target = ev.target as HTMLInputElement;
  //     const { name, value } = target;

  //     // console.log(11, idx, name, value);

  //     setQuestions(oldVals => {
  //       const newVals = [...oldVals];
  //       newVals[idx] = {
  //         ...newVals[idx],
  //         [name]: value,
  //       };

  //       return newVals;
  //     });
  //   },
  //   [setQuestions]
  // );

  // const [formData, setFormData] = React.useState<CreatePollFormData>(() => {
  //   if (poll) {
  //     return {
  //       label: poll.label,
  //       poll_id: poll.poll_id,
  //       plural_voting: poll.plural_voting ? "Plural" : "Singular",
  //       proof_type_id: poll.proof_type_id,
  //       author: poll.author,
  //     };
  //   } else {
  //     return {
  //       plural_voting: "single",
  //     };
  //   }
  // });
  // const [errMsg, setErrMsg] = React.useState("");

  // const handleChangeFormData = React.useCallback(
  //   (ev: any) => {
  //     setFormData(oldState => {
  //       if (oldState) {
  //         return {
  //           ...oldState,
  //           [ev.target.name]: ev.target.value,
  //         };
  //       } else {
  //         return {
  //           [ev.target.name]: ev.target.value,
  //         };
  //       }
  //     });
  //   },
  //   [setFormData]
  // );

  // const mutation = useMutation({
  //   mutationFn: (req: CreatePrfsPollRequest) => {
  //     return prfsApi2("create_prfs_poll", req);
  //   },
  // });

  // const handleSelectProofType = React.useCallback(
  //   (proofTypeItem: ProofTypeItem) => {
  //     setFormData(oldState => {
  //       return { ...oldState, ["proof_type_id"]: proofTypeItem.proofTypeId };
  //     });
  //   },
  //   [setFormData]
  // );

  // const handleClickAddQuestion = React.useCallback(() => {
  //   setQuestions(oldVals => {
  //     return [
  //       ...oldVals,
  //       {
  //         type: "multiple_choice",
  //         label: "",
  //         required: true,
  //         choices: [
  //           {
  //             label: "",
  //           },
  //         ],
  //       },
  //     ];
  //   });
  // }, [setQuestions]);

  // const handleClickCreatePoll = React.useCallback(async () => {
  //   if (formData) {
  //     if (formData.label && formData.plural_voting && formData.proof_type_id && localPrfsAccount) {
  //       const poll_id = formData.proof_type_id || uuidv4();
  //       const { account_id } = localPrfsAccount.prfsAccount;

  //       await mutation.mutateAsync({
  //         poll_id,
  //         plural_voting: formData.plural_voting === "plural",
  //         label: formData.label,
  //         proof_type_id: formData.proof_type_id,
  //         author: account_id,
  //         questions,
  //       });

  //       router.push(paths.polls);
  //     }
  //   }
  // }, [formData, localPrfsAccount, mutation, router, questions]);

  // const questionsElem = React.useMemo(() => {
  //   return questions.map((question, idx) => {
  //     return (
  //       <QuestionBlock
  //         key={idx}
  //         question={question}
  //         idx={idx}
  //         handleChangeQuestions={handleChangeQuestions}
  //         setQuestions={setQuestions}
  //       />
  //     );
  //   });
  // }, [questions, handleChangeQuestions, setQuestions]);

  // console.log(1, questions, formData);

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
      {/* <ContentAreaRow> */}
      {/*   <Widget> */}
      {/*     <WidgetPaddedBody> */}
      {/*       <div className={styles.desc}>{i18n.create_poll_subtitle}</div> */}
      {/*       <div className={styles.textInputContainer}> */}
      {/*         <FormTextInput label={i18n.label} name="label" handleChange={handleChangeFormData} /> */}
      {/*       </div> */}
      {/*       <div className={styles.textInputContainer}> */}
      {/*         <FormTextareaInput */}
      {/*           name="desc" */}
      {/*           label={i18n.description} */}
      {/*           handleChange={handleChangeFormData} */}
      {/*           rows={4} */}
      {/*         /> */}
      {/*       </div> */}
      {/*       <div className={styles.textInputContainer}> */}
      {/*         <div className={styles.inputLabel}>{i18n.choose_proof_type}</div> */}
      {/*         <SelectProofTypeDialog handleSelectProofType={handleSelectProofType} /> */}
      {/*       </div> */}
      {/*       <div className={styles.textInputContainer}> */}
      {/*         <div className={styles.inputLabel}>{i18n.choose_plural_voting}</div> */}
      {/*         <div className={styles.radioGroup} onChange={handleChangeFormData}> */}
      {/*           <label> */}
      {/*             <input type="radio" value="single" name="plural_voting" defaultChecked /> */}
      {/*             <span>{i18n.singular}</span> */}
      {/*           </label> */}
      {/*           <label> */}
      {/*             <input type="radio" value="plural" name="plural_voting" /> */}
      {/*             <span>{i18n.plural}</span> */}
      {/*           </label> */}
      {/*         </div> */}
      {/*       </div> */}
      {/*     </WidgetPaddedBody> */}
      {/*   </Widget> */}
      {/* </ContentAreaRow> */}
      {/* <ContentAreaRow> */}
      {/*   <Widget> */}
      {/*     <WidgetHeader> */}
      {/*       <p className={styles.sectionTitle}>{i18n.questions}</p> */}
      {/*     </WidgetHeader> */}
      {/*     <WidgetPaddedBody> */}
      {/*       <div>{questionsElem}</div> */}
      {/*       <div className={styles.btnRow}> */}
      {/*         <Button variant="transparent_aqua_blue_1" handleClick={handleClickAddQuestion}> */}
      {/*           {i18n.add_question} */}
      {/*         </Button> */}
      {/*       </div> */}
      {/*     </WidgetPaddedBody> */}
      {/*   </Widget> */}
      {/* </ContentAreaRow> */}
      {/* <WidgetPaddedBody> */}
      {/*   <div className={styles.errMsg} style={{ opacity: errMsg.length > 0 ? 1 : 0 }}> */}
      {/*     {errMsg} */}
      {/*   </div> */}
      {/*   <Button variant="aqua_blue_1" handleClick={handleClickCreatePoll}> */}
      {/*     {poll ? i18n.update_poll : i18n.create_poll} */}
      {/*   </Button> */}
      {/* </WidgetPaddedBody> */}
    </div>
  );
};

export default CreatePollPage;

// export interface CreatePollFormProps {
//   poll?: PrfsPoll;
// }

// interface CreatePollFormData {
//   label?: string;
//   plural_voting?: string;
//   proof_type_id?: string;
// }
