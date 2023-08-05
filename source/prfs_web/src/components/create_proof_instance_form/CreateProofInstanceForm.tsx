import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./CreateProofInstanceForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { WidgetHeader, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import CardRow from "@/components/card_row/CardRow";
import Card from "@/components/card/Card";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";
import { FormTitleRow, FormTitle, FormSubtitle } from "@/components/form/Form";
import Button from "@/components/button/Button";
import {
  PrfsCircuit,
  PublicInputType,
  PrfsSet,
  PublicInputInstance,
  PrfsProofType,
} from "@/models";
import { stateContext } from "@/contexts/state";
import * as prfsBackend from "@/fetch/prfsBackend";
import ProofTypeDropdown from "../proof_type_dropdown/ProofTypeDropdown";
import PublicInputConfigSection from "../public_input_config_section/PublicInputConfigSection";
import { useSigner } from "@thirdweb-dev/react";
import { proveMembership, proveMembershipMock } from "@/functions/prfsCrypto";
import { interpolateSystemAssetEndpoint, initDriver } from "@/functions/circuitDriver";
import { MerkleProof } from "@taigalabs/prfs-driver-spartan-js";
import ProofGen from "@taigalabs/prfs-sdk-web/src/ProofGen";

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
  const router = useRouter();
  const signer = useSigner();

  const [publicInputInstance, setPublicInputInstance] = React.useState<PublicInputInstance>({});
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
      // console.log(55, selectedProofType.program_properties);
    }
  }, [selectedProofType]);

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

    const { driver_id, driver_properties } = selectedProofType;
    console.log(12, selectedProofType.driver_properties);

    let driverProperties = interpolateSystemAssetEndpoint(driver_properties);
    console.log(13, driverProperties);

    const driver = await initDriver(driver_id, driverProperties);

    let buildStatus = await driver.getBuildStatus();
    console.log("buildStatus: %s", buildStatus);

    let addrs = [
      "0x33d10ab178924ecb7ad52f4c0c8062c3066607ec",
      "0x4f6fcaae3fc4124acaccc780c6cb0dd69ddbeff8",
      "0x50d34ee0ac40da7779c42d3d94c2072e5625395f",
      "0x51c0e162bd86b63933262d558a8953def4e30c85",
    ];

    let merkleProof: MerkleProof = await driver.makeMerkleProof(addrs, BigInt(0), 32);
    console.log("merkle proof", merkleProof);

    // root: bigint;
    // siblings: bigint[];
    // pathIndices: number[];

    // let poseidon = prfs.newPoseidon();
    // const msg = Buffer.from("harry potter");
    // const msgHash = hashPersonalMessage(msg);

    // let sig = await signer.signMessage(msg);
    // console.log("sig", sig);

    // let verifyMsg = ethers.utils.verifyMessage(msg, sig);
    // console.log("verified addr", verifyMsg);

    // let proverAddress = await signer.getAddress();
    // console.log("proverAddr", proverAddress);

    // const proverAddr = BigInt(proverAddress);
    // console.log("proverAddr", proverAddr);

    // const addr1 = BigInt(addrs[1]);
    // console.log("Addr1", addr1);

    // console.log("Proving...");
    // console.time("Full proving time");
    // // const proofGen = spart.newMembershipProofGen(wtnsGenUrl, circuitUrl);
    // const { proof, publicInput } = await spartanDriver.prove(sig, msgHash, merkleProof);

    // console.timeEnd("Full proving time");
    // console.log("Raw proof size (excluding public input)", proof.length, "bytes");

    // console.log("Verifying...");

    // console.time("Verification time");
    // const result = await spartanDriver.verify(proof, publicInput.serialize());
    // console.timeEnd("Verification time");

    // if (result) {
    //   console.log("Successfully verified proof!");
    // } else {
    //   console.log("Failed to verify proof :(");
    // }

    // await proveMembership(signer, circuitUrl, wtnsGenUrl);

    // let { y, m, d } = getYMD();
    // let now = Date.now();
    // let hash = keccakHash(
    //   `${selectedCircuit.circuit_id}_${selectedCircuit.program.program_id}_${now}`
    // ).substring(2, 8);

    // let proof_type_id = `${prfsAccount.id}_${y}${m}${d}_${hash}`;

    // let createPrfsProofTypeRequest = {
    //   proof_type_id,
    //   label: name,
    //   desc,
    //   author: prfsAccount.sig,
    //   circuit_id: selectedCircuit.circuit_id,
    //   program_id: selectedCircuit.program.program_id,
    //   public_input_instance: newPublicInputInstance,
    //   program_properties: selectedCircuit.program.properties,
    // };

    // prfsBackend
    //   .createPrfsProofType(createPrfsProofTypeRequest)
    //   .then(_res => {
    //     router.push("/proof_types");
    //   })
    //   .catch(err => {
    //     setFormAlert(err);
    //   });
  }, [publicInputInstance, selectedProofType, setFormAlert, state.prfsAccount]);

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
          <Card>
            <ProofGen />
            {/* <Widget> */}
            {/*   <WidgetHeader> */}
            {/*     <WidgetLabel>{i18n.driver}</WidgetLabel> */}
            {/*   </WidgetHeader> */}
            {/*   <WidgetPaddedBody> */}
            {/*     <ProgramSection proofType={selectedProofType} /> */}
            {/*   </WidgetPaddedBody> */}
            {/* </Widget> */}
          </Card>
        </CardRow>
      )}

      {formAlert.length > 0 && <div className={styles.alert}>{formAlert}</div>}

      <div className={styles.btnRow}>
        <Button variant="b" handleClick={handleClickCreateProofInstance}>
          {i18n.create_proof_type}
        </Button>
      </div>
    </div>
  );
};

export default CreateProofInstanceForm;

export interface CreateProofInstanceFormProps {}

interface ProgramSectionProps {
  proofType: PrfsProofType;
}
