import React from "react";
import { useRouter } from "next/navigation";
import { PrfsPoll } from "@taigalabs/prfs-entities/bindings/PrfsPoll";
import { v4 as uuidv4 } from "uuid";
import { PollQuestion } from "@taigalabs/prfs-entities/bindings/PollQuestion";
import { SubmitPrfsPollResponseRequest } from "@taigalabs/prfs-entities/bindings/SubmitPrfsPollResponseRequest";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { useMutation } from "@tanstack/react-query";
import { PrfsSDK } from "@taigalabs/prfs-sdk-web";
import { ethers } from "ethers";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";

import styles from "./PollView.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import Question from "./Question";

const prfs = new PrfsSDK("test");

const PollView: React.FC<PollViewProps> = ({ poll }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const [proofGenElement, setProofGenElement] = React.useState<ProofGenElement>();

  const [formData, setFormData] = React.useState<string[]>([]);
  const handleChangeForm = React.useCallback(
    (ev: React.ChangeEvent | React.FormEvent) => {
      const target = ev.target as any;

      const { name, value } = target;

      setFormData(oldVal => {
        const newVal = [...oldVal];
        newVal[Number(name)] = value;

        return newVal;
      });
    },
    [setFormData],
  );

  React.useEffect(() => {
    async function fn() {
      if (poll) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // const proofGenElement = prfs.create("proof-gen", {
        //   proofTypeId: poll.proof_type_id,
        //   provider,
        // });

        // await proofGenElement.mount("#prfs-sdk-container");

        // setProofGenElement(proofGenElement);
      }
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

  const mutation = useMutation({
    mutationFn: (req: SubmitPrfsPollResponseRequest) => {
      return prfsApi2("submit_prfs_poll_response", req);
    },
  });

  const handleClickSubmit = React.useCallback(async () => {
    if (proofGenElement) {
      console.log(formData);
      const proveReceipt = await proofGenElement.createProof();

      if (proveReceipt === null) {
        throw new Error("prove is not created");
      }

      const { proveResult } = proveReceipt;
      const { proof, publicInputSer } = proveResult;
      const public_inputs = JSON.parse(publicInputSer);

      const serialNo = public_inputs.circuitPubInput.serialNo;
      if (!serialNo) {
        throw new Error("Serial no does not exist");
      }

      const proof_instance_id = uuidv4();

      console.log("try submiting poll", proveReceipt);
      try {
        await mutation.mutateAsync({
          proof_instance_id,
          account_id: null,
          proof_type_id: poll.proof_type_id,
          proof: Array.from(proof),
          public_inputs,
          poll_id: poll.poll_id,
          serial_no: serialNo,
          value: formData,
        });

        window.location.reload();
      } catch (err: any) {
        console.error(err);
        return;
      }
    }
  }, [formData, proofGenElement, mutation, poll]);

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
