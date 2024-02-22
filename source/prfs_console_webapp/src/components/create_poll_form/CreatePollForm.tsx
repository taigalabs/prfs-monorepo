import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import SearchProofDialog from "@taigalabs/prfs-react-lib/src/search_proof_dialog/SearchProofDialog";
import { CreatePrfsPollRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsPollRequest";
import { PollQuestion } from "@taigalabs/prfs-entities/bindings/PollQuestion";

import styles from "./CreatePoll.module.scss";
import { i18nContext } from "@/i18n/context";
import Widget, { WidgetHeader, WidgetPaddedBody } from "@/components/widget/Widget";
import FormTextInput from "@/components/form/FormTextInput";
import { paths } from "@/paths";
import FormTextareaInput from "@/components/form/FormTextareaInput";
import { ContentAreaRow } from "@/components/content_area/ContentArea";
import { useAppSelector } from "@/state/hooks";
import QuestionBlock from "./QuestionBlock";
import { PrfsPoll } from "@taigalabs/prfs-entities/bindings/PrfsPoll";
import { PollQuestionType } from "@taigalabs/prfs-entities/bindings/PollQuestionType";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { GetPrfsProofTypeByProofTypeIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypeByProofTypeIdRequest";

const CreatePollForm: React.FC<CreatePollFormProps> = ({ poll }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const localPrfsAccount = useAppSelector(state => state.user.localPrfsAccount);
  const [proofType, setProofType] = React.useState<PrfsProofType>();

  const [questions, setQuestions] = React.useState<PollQuestion[]>(
    (poll?.questions as PollQuestion[]) || [
      {
        type: "MultipleChoice" as PollQuestionType,
        label: "",
        required: true,
        choices: [
          {
            label: "",
          },
        ],
      },
    ],
  );

  const handleChangeQuestions = React.useCallback(
    (idx: number, ev: React.ChangeEvent) => {
      const target = ev.target as HTMLInputElement;
      const { name, value } = target;

      // console.log(11, idx, name, value);

      setQuestions(oldVals => {
        const newVals = [...oldVals];
        newVals[idx] = {
          ...newVals[idx],
          [name]: value,
        };

        return newVals;
      });
    },
    [setQuestions],
  );

  const [formData, setFormData] = React.useState<CreatePollFormData>(() => {
    if (poll) {
      return {
        label: poll.label,
        poll_id: poll.poll_id,
        plural_voting: poll.plural_voting ? "true" : "false",
        proof_type_id: poll.proof_type_id,
        description: poll.description,
        author: poll.author,
      };
    } else {
      return {
        plural_voting: "false",
      };
    }
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
    [setFormData],
  );

  const { mutateAsync: getPrfsProofTypeByProofTypeIdRequest } = useMutation({
    mutationFn: (req: GetPrfsProofTypeByProofTypeIdRequest) => {
      return prfsApi2("get_prfs_proof_type_by_proof_type_id", req);
    },
  });

  const mutation = useMutation({
    mutationFn: (req: CreatePrfsPollRequest) => {
      return prfsApi2("create_prfs_poll", req);
    },
  });

  // const handleSelectProofType = React.useCallback(
  //   (proofType: PrfsProofType) => {
  //     setFormData(oldState => {
  //       return { ...oldState, ["proof_type_id"]: proofType.proof_type_id };
  //     });
  //   },
  //   [setFormData]
  // );

  const handleSelectProofType = React.useCallback(
    async (proofType: PrfsProofType) => {
      const { payload } = await getPrfsProofTypeByProofTypeIdRequest({
        proof_type_id: proofType.proof_type_id,
      });

      if (payload) {
        setProofType(payload.prfs_proof_type);
        setFormData(oldState => {
          return { ...oldState, ["proof_type_id"]: proofType.proof_type_id };
        });
      }
    },
    [getPrfsProofTypeByProofTypeIdRequest, setProofType, setFormData],
  );

  const handleClickAddQuestion = React.useCallback(() => {
    setQuestions(oldVals => {
      return [
        ...oldVals,
        {
          type: "MultipleChoice",
          label: "",
          required: true,
          choices: [
            {
              label: "",
            },
          ],
        },
      ];
    });
  }, [setQuestions]);

  const handleClickCreatePoll = React.useCallback(async () => {
    if (formData) {
      if (formData.label && formData.plural_voting && formData.proof_type_id && localPrfsAccount) {
        const poll_id = poll?.poll_id || uuidv4();
        const { account_id } = localPrfsAccount.prfsAccount;

        await mutation.mutateAsync({
          poll_id,
          plural_voting: formData.plural_voting === "true",
          label: formData.label,
          proof_type_id: formData.proof_type_id,
          author: account_id,
          description: formData.description || "",
          questions,
        });

        router.push(paths.polls);
      }
    }
  }, [formData, localPrfsAccount, mutation, router, questions]);

  const questionsElem = React.useMemo(() => {
    return questions.map((question, idx) => {
      return (
        <QuestionBlock
          key={idx}
          question={question}
          idx={idx}
          handleChangeQuestions={handleChangeQuestions}
          setQuestions={setQuestions}
        />
      );
    });
  }, [questions, handleChangeQuestions, setQuestions]);

  return (
    <div className={styles.wrapper}>
      <ContentAreaRow>
        <Widget>
          <WidgetPaddedBody>
            <div className={styles.desc}>{i18n.create_poll_subtitle}</div>
            <div className={styles.textInputContainer}>
              <FormTextInput
                label={i18n.label}
                name="label"
                value={formData.label}
                handleChange={handleChangeFormData}
              />
            </div>
            <div className={styles.textInputContainer}>
              <FormTextareaInput
                name="description"
                label={i18n.description}
                value={formData.description}
                handleChange={handleChangeFormData}
                rows={2}
              />
            </div>
            <div className={styles.textInputContainer}>
              <div className={styles.inputLabel}>{i18n.choose_proof_type}</div>
              <SearchProofDialog
                proofType={proofType}
                handleSelectProofType={handleSelectProofType}
                webappConsoleEndpoint={process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}
              />
            </div>
            <div className={styles.textInputContainer}>
              <div className={styles.inputLabel}>{i18n.choose_plural_voting}</div>
              <div className={styles.radioGroup}>
                <select
                  name="plural_voting"
                  value={formData.plural_voting}
                  onChange={handleChangeFormData}
                >
                  <option value="true">{i18n.true}</option>
                  <option value="false">{i18n.false}</option>
                </select>
              </div>
            </div>
          </WidgetPaddedBody>
        </Widget>
      </ContentAreaRow>

      <ContentAreaRow>
        <Widget>
          <WidgetHeader>
            <p className={styles.sectionTitle}>{i18n.questions}</p>
          </WidgetHeader>
          <WidgetPaddedBody>
            <div>{questionsElem}</div>
            <div className={styles.btnRow}>
              <Button variant="transparent_aqua_blue_1" handleClick={handleClickAddQuestion}>
                {i18n.add_question}
              </Button>
            </div>
          </WidgetPaddedBody>
        </Widget>
      </ContentAreaRow>

      <WidgetPaddedBody>
        <div className={styles.errMsg} style={{ opacity: errMsg.length > 0 ? 1 : 0 }}>
          {errMsg}
        </div>

        <Button variant="aqua_blue_1" handleClick={handleClickCreatePoll}>
          {poll ? i18n.update_poll : i18n.create_poll}
        </Button>
      </WidgetPaddedBody>
    </div>
  );
};

export default CreatePollForm;

export interface CreatePollFormProps {
  poll?: PrfsPoll;
}

interface CreatePollFormData {
  label?: string;
  description?: string;
  plural_voting?: string;
  proof_type_id?: string;
}
