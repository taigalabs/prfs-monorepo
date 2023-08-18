import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { MsgType, PrfsSDK, sendMsgToChild } from "@taigalabs/prfs-sdk-web";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";

import styles from "./CreateProofInstanceForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { WidgetHeader, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import CardRow from "@/components/card_row/CardRow";
import Card from "@/components/card/Card";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";
import { FormTitleRow, FormTitle, FormSubtitle } from "@/components/form/Form";
import { stateContext } from "@/contexts/state";
import ProofTypeDropdown from "@/components/proof_type_dropdown/ProofTypeDropdown";
import CircuitInputConfigSection from "@/components/circuit_input_config_section/CircuitInputConfigSection";
import { useSigner } from "@thirdweb-dev/react";
// import { interpolateSystemAssetEndpoint, initDriver } from "@/functions/circuitDriver";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";
import { ProveResult } from "@taigalabs/prfs-driver-interface";

///
import { hashPersonalMessage } from "@ethereumjs/util";
import { ethers } from "ethers";
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";
import { PaddedTableWrapper } from "../table/Table";

const prfs = new PrfsSDK("test");

const CreateProofInstanceForm: React.FC<CreateProofInstanceFormProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { state } = React.useContext(stateContext);
  const { prfsAccount } = state;
  const router = useRouter();
  const signer = useSigner();

  const [publicInputInstance, setPublicInputInstance] = React.useState<
    Record<string, CircuitInput>
  >({});
  const [formAlert, setFormAlert] = React.useState("");
  const [selectedProofType, setSelectedProofType] = React.useState<PrfsProofType | undefined>();
  const [programProps, setProgramProps] = React.useState();
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
        console.log(55, selectedProofType);
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

      const proof_instance_id = `${prfsAccount.id}_${selectedProofType.proof_type_id.substring(
        -6
      )}_${Date.now()}`;

      console.log("try inserting proof", proveReceipt);
      await prfsApi.createPrfsProofInstance({
        proof_instance_id,
        sig: prfsAccount.sig,
        proof_type_id: selectedProofType.proof_type_id,
        proof: Array.from(proof),
        public_inputs,
      });

      router.push("/proofs");
    }
  }, [publicInputInstance, selectedProofType, setFormAlert, state.prfsAccount, proofGenElement]);

  return (
    <div className={styles.wrapper}>
      <WidgetPaddedBody>
        <div className={styles.breadcrumbContainer}>
          <Breadcrumb>
            <BreadcrumbEntry>
              <Link href="/proofs">{i18n.proofs}</Link>
            </BreadcrumbEntry>
            <BreadcrumbEntry>{i18n.create_proof_type}</BreadcrumbEntry>
          </Breadcrumb>
        </div>
        <FormTitleRow>
          <FormTitle>{i18n.create_proof_instance}</FormTitle>
          <FormSubtitle>{i18n.create_proof_instance_subtitle}</FormSubtitle>
        </FormTitleRow>
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
          <CardRow>
            <Card>
              <Widget>
                <WidgetHeader>
                  <WidgetLabel>{i18n.get_ready_to_make_proof}</WidgetLabel>
                </WidgetHeader>
                <WidgetPaddedBody>
                  <div id="prfs-sdk-container"></div>
                  <div className={styles.btnRow}>
                    <Button variant="c" handleClick={handleClickCreateProofInstance}>
                      {i18n.create_proof_instance}
                    </Button>
                  </div>
                </WidgetPaddedBody>
              </Widget>
            </Card>
          </CardRow>
        </Fade>
      )}

      {formAlert.length > 0 && <div className={styles.alert}>{formAlert}</div>}
    </div>
  );
};

export default CreateProofInstanceForm;

export interface CreateProofInstanceFormProps {}
