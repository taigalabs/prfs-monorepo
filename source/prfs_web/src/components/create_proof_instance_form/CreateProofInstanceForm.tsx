import React from "react";
import Link from "next/link";
import { ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { PrfsSDK } from "@taigalabs/prfs-sdk-web";
import * as prfsApi from "@taigalabs/prfs-api-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";

import styles from "./CreateProofInstanceForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, {
  TopWidgetTitle,
  WidgetHeader,
  WidgetLabel,
  WidgetPaddedBody,
} from "@/components/widget/Widget";
import { stateContext } from "@/contexts/state";
import ProofTypeDropdown from "@/components/proof_type_dropdown/ProofTypeDropdown";
import { paths } from "@/paths";
import { ContentAreaRow } from "../content_area/ContentArea";

const prfs = new PrfsSDK("test");

const CreateProofInstanceForm: React.FC<CreateProofInstanceFormProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { state } = React.useContext(stateContext);
  const { localPrfsAccount } = state;
  const router = useRouter();

  const [formAlert, setFormAlert] = React.useState("");
  const [selectedProofType, setSelectedProofType] = React.useState<PrfsProofType | undefined>();
  const [proofGenElement, setProofGenElement] = React.useState<ProofGenElement>();

  const handleSelectProofType = React.useCallback(
    (val: PrfsProofType) => {
      setSelectedProofType(val);
    },
    [setSelectedProofType]
  );

  const handleCreateProof = React.useCallback(({ proof, publicInput }: any) => {
    console.log("Created proof!", proof, publicInput);
  }, []);

  React.useEffect(() => {
    async function fn() {
      if (selectedProofType) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const proofGenElement = prfs.create("proof-gen", {
          proofType: selectedProofType,
          provider,
          handleCreateProof,
        });

        await proofGenElement.mount("#prfs-sdk-container");

        setProofGenElement(proofGenElement);
      }
    }

    fn().then();
  }, [selectedProofType, handleCreateProof, setProofGenElement]);

  const handleClickCreateProofInstance = React.useCallback(async () => {
    setFormAlert("");

    if (!localPrfsAccount) {
      setFormAlert("User is not signed in");
      return;
    }

    const { prfsAccount } = localPrfsAccount;

    if (!prfsAccount) {
      setFormAlert("User is not signed in");
      return;
    }

    if (selectedProofType === undefined) {
      setFormAlert("Proof type should be selected");
      return;
    }

    if (!proofGenElement) {
      setFormAlert("PRFS sdk is undefined");
      return;
    }

    const proveReceipt = await proofGenElement.createProof();

    if (proveReceipt) {
      const { duration, proveResult } = proveReceipt;
      const { proof, publicInputSer } = proveResult;
      const public_inputs = JSON.parse(publicInputSer);

      console.log("took %s ms to create a proof", duration);

      let proof_instance_id = uuidv4();

      console.log("try inserting proof", proveReceipt);
      const resp = await prfsApi.createPrfsProofInstance({
        proof_instance_id,
        sig: prfsAccount.sig,
        proof_type_id: selectedProofType.proof_type_id,
        proof: Array.from(proof),
        public_inputs,
      });

      router.push(`${paths.proof__proof_instances}/${resp.payload.proof_instance_id}`);
    }
  }, [selectedProofType, setFormAlert, localPrfsAccount, proofGenElement]);

  return (
    <div className={styles.wrapper}>
      <TopWidgetTitle>
        <div className={styles.header}>
          <Link href={paths.proof__proof_instances}>
            <ArrowButton variant="left" />
          </Link>
          <WidgetLabel>{i18n.create_proof_instance}</WidgetLabel>
        </div>
      </TopWidgetTitle>

      <WidgetPaddedBody>
        <div className={styles.desc}>{i18n.create_proof_type_subtitle}</div>
      </WidgetPaddedBody>

      <Widget>
        <WidgetHeader>
          <WidgetLabel>{i18n.choose_proof_type}</WidgetLabel>
        </WidgetHeader>
        <WidgetPaddedBody>
          <div className={styles.dropdownContainer}>
            <div>{i18n.proof_type}</div>
            <ProofTypeDropdown
              selectedVal={selectedProofType}
              handleSelectVal={handleSelectProofType}
            />
          </div>
        </WidgetPaddedBody>
      </Widget>

      {selectedProofType && (
        <Fade>
          <ContentAreaRow>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{i18n.get_ready_to_make_proof}</WidgetLabel>
              </WidgetHeader>
              <WidgetPaddedBody>
                <div id="prfs-sdk-container"></div>
                <div className={styles.btnRow}>
                  <Button variant="aqua_blue_1" handleClick={handleClickCreateProofInstance}>
                    {i18n.create_proof_instance}
                  </Button>
                </div>
              </WidgetPaddedBody>
            </Widget>
          </ContentAreaRow>
        </Fade>
      )}

      {formAlert.length > 0 && <div className={styles.alert}>{formAlert}</div>}
    </div>
  );
};

export default CreateProofInstanceForm;

export interface CreateProofInstanceFormProps {}
