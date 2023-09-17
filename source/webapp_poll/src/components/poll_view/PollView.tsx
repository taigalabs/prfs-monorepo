import React from "react";
import { useRouter } from "next/navigation";
import { PrfsPoll } from "@taigalabs/prfs-entities/bindings/PrfsPoll";
import { PollQuestion } from "@taigalabs/prfs-entities/bindings/PollQuestion";
import { prfsApi2 } from "@taigalabs/prfs-api-js";

import styles from "./PollView.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import Question from "./Question";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { useMutation } from "@tanstack/react-query";

const PollView: React.FC<PollViewProps> = ({ poll }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const handleChangeForm = React.useCallback(
    (ev: React.ChangeEvent | React.FormEvent) => {
      const target = ev.target as any;

      const { name, value } = target;

      setFormData(oldVal => {
        return {
          ...oldVal,
          [name]: value,
        };
      });
    },
    [setFormData]
  );

  const questionsElem = React.useMemo(() => {
    return poll.questions.map((qst, idx) => {
      const question = qst as PollQuestion;
      return (
        <Question
          key={idx}
          questionIdx={idx}
          question={question}
          handleChangeForm={handleChangeForm}
        />
      );
    });
  }, [poll, setFormData]);

  const mutation = useMutation(() => {});

  const handleClickSubmit = React.useCallback(() => {
    console.log(22, formData);
  }, [formData]);

  return (
    <div className={styles.wrapper}>
      <div>
        <p className={styles.label}>{poll.label}</p>
        <p className={styles.desc}>{poll.description}</p>
      </div>
      <div className={styles.questions}>{questionsElem}</div>
      <div className={styles.btnRow}>
        <Button variant="aqua_blue_1" handleClick={handleClickSubmit}>
          {i18n.submit}
        </Button>
      </div>
    </div>
  );
};

export default PollView;

export interface PollViewProps {
  poll: PrfsPoll;
}
