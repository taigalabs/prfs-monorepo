import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { PrfsSDK } from "@taigalabs/prfs-sdk-web";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import { PublicInputType } from "@taigalabs/prfs-entities/bindings/PublicInputType";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PublicInputInstanceEntry } from "@taigalabs/prfs-entities/bindings/PublicInputInstanceEntry";

import styles from "./CreateProofInstanceForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { WidgetHeader, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import CardRow from "@/components/card_row/CardRow";
import Card from "@/components/card/Card";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";
import { FormTitleRow, FormTitle, FormSubtitle } from "@/components/form/Form";
import Button from "@/components/button/Button";
import { stateContext } from "@/contexts/state";
import ProofTypeDropdown from "../proof_type_dropdown/ProofTypeDropdown";
import PublicInputConfigSection from "../public_input_config_section/PublicInputConfigSection";
import { useSigner } from "@thirdweb-dev/react";
import { proveMembership, proveMembershipMock } from "@/functions/prfsCrypto";
import { interpolateSystemAssetEndpoint, initDriver } from "@/functions/circuitDriver";
import { MerkleProof } from "@taigalabs/prfs-driver-spartan-js";

///
import { hashPersonalMessage } from "@ethereumjs/util";
import { ethers } from "ethers";
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";

const prfs = new PrfsSDK("test");

const ProgramSection: React.FC<ProgramSectionProps> = ({ proofType }) => {
  const i18n = React.useContext(i18nContext);

  const programPropsElem = React.useMemo(() => {
    const rows = [];

    if (!proofType) {
      return rows;
    }

    for (let [propName, val] of Object.entries(proofType.driver_properties)) {
      if (val.startsWith("prfs://")) {
        val = val.replace("prfs:/", process.env.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT);
        val = <Link href={val}>{val}</Link>;
      }

      rows.push(
        <div className={styles.item} key={propName}>
          <div className={styles.label}>{propName}</div>
          <div className={styles.value}>{val}</div>
        </div>
      );
    }

    return rows;
  }, [proofType]);

  return (
    <div className={styles.programSectionWrapper}>
      <div className={styles.item}>
        <div className={styles.label}>{i18n.driver_id}</div>
        <div className={styles.value}>{proofType.driver_id}</div>
      </div>
      {programPropsElem}
    </div>
  );
};

const CreateProofInstanceForm: React.FC<CreateProofInstanceFormProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { state } = React.useContext(stateContext);
  const { prfsAccount } = state;
  // const router = useRouter();
  const signer = useSigner();

  // console.log(15, signer);

  const [publicInputInstance, setPublicInputInstance] = React.useState<
    Record<string, PublicInputInstanceEntry>
  >({});
  const [formAlert, setFormAlert] = React.useState("");
  const [selectedProofType, setSelectedProofType] = React.useState<PrfsProofType>(undefined);
  const [programProps, setProgramProps] = React.useState();

  const handleSelectProofType = React.useCallback(
    (val: PrfsProofType) => {
      setSelectedProofType(val);
    },
    [setSelectedProofType]
  );

  React.useEffect(() => {
    if (selectedProofType) {
      console.log(55, selectedProofType);

      const proofGenElement = prfs.create("proof-gen", {
        selectedProofType,
      });

      proofGenElement.mount("#prfs-sdk-container");
    }
  }, [selectedProofType]);

  const handleCreateProof = React.useCallback((proof: Uint8Array, publicInput: any) => {
    console.log("Created proof!", proof, publicInput);
  }, []);

  // const handleClickCreateProofInstance = React.useCallback(async () => {
  //   setFormAlert("");

  //   if (!prfsAccount) {
  //     setFormAlert("User is not signed in");
  //     return;
  //   }

  //   if (selectedProofType === undefined) {
  //     setFormAlert("Proof type should be selected");
  //     return;
  //   }

  //   console.log(11, selectedProofType);

  //   const addr = await signer.getAddress();
  //   console.log("my address: %s", addr);
  //   if (!selectedProofType.public_input_instance[4].ref) {
  //     throw new Error("set id (ref) is not defined");
  //   }

  //   const setId = selectedProofType.public_input_instance[4].ref;
  //   let { payload } = await prfsBackend.getPrfsTreeLeafNodes({
  //     set_id: setId,
  //     leaf_vals: [addr],
  //   });

  //   let pos_w = null;
  //   for (const node of payload.prfs_tree_nodes) {
  //     if (node.val === addr.toLowerCase()) {
  //       pos_w = node.pos_w;
  //     }
  //   }

  //   if (pos_w === null) {
  //     throw new Error("Address is not part of a set");
  //   }

  //   const leafIdx = Number(pos_w);
  //   const siblingPath = makeSiblingPath(32, Number(pos_w));
  //   const pathIndices = makePathIndices(32, Number(pos_w));

  //   const siblingPos = siblingPath.map((pos_w, idx) => {
  //     return { pos_h: idx, pos_w };
  //   });

  //   console.log("siblingPos: %o", siblingPos);

  //   const data = await prfsBackend.getPrfsTreeNodes({
  //     set_id: setId,
  //     pos: siblingPos,
  //   });

  //   console.log(55, data);

  //   let siblings: BigInt[] = [];
  //   for (const node of data.payload.prfs_tree_nodes) {
  //     siblings[node.pos_h] = BigInt(node.val);
  //   }

  //   for (let idx = 0; idx < 32; idx += 1) {
  //     if (siblings[idx] === undefined) {
  //       siblings[idx] = BigInt(0);
  //     }
  //   }

  //   console.log(22, siblings);

  //   const { driver_id, driver_properties } = selectedProofType;
  //   console.log(12, selectedProofType.driver_properties);

  //   let driverProperties = interpolateSystemAssetEndpoint(driver_properties);
  //   console.log(13, driverProperties);

  //   const driver = await initDriver(driver_id, driverProperties);

  //   // await proveMembership(signer, driver, 4);
  //   // await proveMembershipMock(driver);

  //   let merkleProof = {
  //     root: BigInt(selectedProofType.public_input_instance[4].value),
  //     siblings,
  //     pathIndices,
  //   };

  //   console.log(55, merkleProof);

  //   const msg = Buffer.from("harry potter");
  //   const msgHash = hashPersonalMessage(msg);

  //   let sig = await signer.signMessage(msg);
  //   console.log("sig", sig);

  //   let verifyMsg = ethers.utils.verifyMessage(msg, sig);
  //   console.log("verified addr", verifyMsg);

  //   let proverAddress = await signer.getAddress();
  //   console.log("proverAddr", proverAddress);

  //   console.log("Proving...");
  //   console.time("Full proving time");
  //   const { proof, publicInput } = await driver.prove(sig, msgHash, merkleProof);

  //   console.timeEnd("Full proving time");
  //   console.log("Raw proof size (excluding public input)", proof.length, "bytes");

  //   console.log("Verifying...");

  //   console.time("Verification time");
  //   const result = await driver.verify(proof, publicInput.serialize());
  //   console.timeEnd("Verification time");

  //   if (result) {
  //     console.log("Successfully verified proof!");
  //   } else {
  //     console.log("Failed to verify proof :(");
  //   }

  //   // await proveMembership(signer, circuitUrl, wtnsGenUrl);

  //   // let { y, m, d } = getYMD();
  //   // let now = Date.now();
  //   // let hash = keccakHash(
  //   //   `${selectedCircuit.circuit_id}_${selectedCircuit.program.program_id}_${now}`
  //   // ).substring(2, 8);

  //   // let proof_type_id = `${prfsAccount.id}_${y}${m}${d}_${hash}`;

  //   // let createPrfsProofTypeRequest = {
  //   //   proof_type_id,
  //   //   label: name,
  //   //   desc,
  //   //   author: prfsAccount.sig,
  //   //   circuit_id: selectedCircuit.circuit_id,
  //   //   program_id: selectedCircuit.program.program_id,
  //   //   public_input_instance: newPublicInputInstance,
  //   //   program_properties: selectedCircuit.program.properties,
  //   // };

  //   // prfsBackend
  //   //   .createPrfsProofType(createPrfsProofTypeRequest)
  //   //   .then(_res => {
  //   //     router.push("/proof_types");
  //   //   })
  //   //   .catch(err => {
  //   //     setFormAlert(err);
  //   //   });
  // }, [publicInputInstance, selectedProofType, setFormAlert, state.prfsAccount]);

  // console.log(11, selectedProofType);

  return (
    <div className={styles.wrapper}>
      <Breadcrumb>
        <BreadcrumbEntry>
          <Link href="/proofs">{i18n.proofs}</Link>
        </BreadcrumbEntry>
        <BreadcrumbEntry>{i18n.create_proof_type}</BreadcrumbEntry>
      </Breadcrumb>
      <FormTitleRow>
        <FormTitle>{i18n.create_proof_instance}</FormTitle>
        <FormSubtitle>{i18n.create_proof_instance_subtitle}</FormSubtitle>
      </FormTitleRow>

      <CardRow>
        <Card>
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
        </Card>
      </CardRow>

      {selectedProofType && (
        <CardRow>
          <div id="prfs-sdk-container">
            {/* <ProofGen */}
            {/*   proofType={selectedProofType} */}
            {/*   handleCreateProof={handleCreateProof} */}
            {/*   signer={signer} */}
            {/* /> */}
          </div>
        </CardRow>
      )}

      {formAlert.length > 0 && <div className={styles.alert}>{formAlert}</div>}

      {/* <div className={styles.btnRow}> */}
      {/*   <Button variant="b" handleClick={handleClickCreateProofInstance}> */}
      {/*     {i18n.create_proof_type} */}
      {/*   </Button> */}
      {/* </div> */}
    </div>
  );
};

export default CreateProofInstanceForm;

export interface CreateProofInstanceFormProps {}

interface ProgramSectionProps {
  proofType: PrfsProofType;
}
