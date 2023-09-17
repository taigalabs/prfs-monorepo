import React from "react";
import { useRouter } from "next/navigation";
import { PrfsPoll } from "@taigalabs/prfs-entities/bindings/PrfsPoll";
import { PollQuestion } from "@taigalabs/prfs-entities/bindings/PollQuestion";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { useMutation } from "@tanstack/react-query";
import { PrfsSDK } from "@taigalabs/prfs-sdk-web";
import { ethers } from "ethers";

import styles from "./PollView.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import Question from "./Question";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";

const prfs = new PrfsSDK("test");

const PollView: React.FC<PollViewProps> = ({ poll }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const [proofGenElement, setProofGenElement] = React.useState<ProofGenElement>();

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

  React.useEffect(() => {
    async function fn() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const proofGenElement = prfs.create("proof-gen", {
        proofTypeId: poll.proof_type_id,
        provider,
        handleCreateProof: () => {},
      });

      await proofGenElement.mount("#prfs-sdk-container");

      setProofGenElement(proofGenElement);
    }

    fn().then();
  }, [poll, setProofGenElement]);

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

  // const mutation = useMutation({
  //   mutationFn: (req: CreatePrfsPollRequest) => {
  //     return prfsApi2("create_prfs_poll", req);
  //   },
  // });

  const handleClickSubmit = React.useCallback(async () => {
    if (proofGenElement) {
      const proveReceipt = await proofGenElement.createProof();

      console.log(22, formData, proveReceipt);
    }
  }, [formData, proofGenElement]);

  return (
    <div className={styles.wrapper}>
      <div>
        <p className={styles.label}>{poll.label}</p>
        <p className={styles.desc}>{poll.description}</p>
      </div>
      <div className={styles.questions}>{questionsElem}</div>
      <div className={styles.prfsSdk}>
        <div id="prfs-sdk-container"></div>
      </div>
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
