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
import { interpolateSystemAssetEndpoint, initDriver } from "@/functions/circuitDriver";
// import { SpartanMerkleProof } from "@taigalabs/prfs-driver-spartan-js";

///
import { hashPersonalMessage } from "@ethereumjs/util";
import { ethers } from "ethers";
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";
import { PaddedTableWrapper } from "../table/Table";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";

const prfs = new PrfsSDK("test");

const CreateProofInstanceForm: React.FC<CreateProofInstanceFormProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { state } = React.useContext(stateContext);
  const { prfsAccount } = state;
  // const router = useRouter();
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
        console.log("sdk is loaded");

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

    // proofGenElement.createProof();

    // console.log(11, selectedProofType);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const addr = await signer.getAddress();
    console.log("my address: %s", addr);
    if (!selectedProofType.circuit_inputs[1].ref) {
      throw new Error("set id (ref) is not defined");
    }

    const setId = selectedProofType.circuit_inputs[1].value;
    let { payload } = await prfsApi.getPrfsTreeLeafNodes({
      set_id: setId,
      leaf_vals: [addr],
    });

    let pos_w = null;
    for (const node of payload.prfs_tree_nodes) {
      if (node.val === addr.toLowerCase()) {
        pos_w = node.pos_w;
      }
    }

    if (pos_w === null) {
      throw new Error("Address is not part of a set");
    }

    const leafIdx = Number(pos_w);
    const siblingPath = makeSiblingPath(32, Number(pos_w));
    const pathIndices = makePathIndices(32, Number(pos_w));

    const siblingPos = siblingPath.map((pos_w, idx) => {
      return { pos_h: idx, pos_w };
    });

    console.log("siblingPos: %o", siblingPos);

    const data = await prfsApi.getPrfsTreeNodes({
      set_id: setId,
      pos: siblingPos,
    });

    console.log(55, data);

    let siblings: BigInt[] = [];
    for (const node of data.payload.prfs_tree_nodes) {
      siblings[node.pos_h] = BigInt(node.val);
    }

    for (let idx = 0; idx < 32; idx += 1) {
      if (siblings[idx] === undefined) {
        siblings[idx] = BigInt(0);
      }
    }

    const { driver_id, driver_properties } = selectedProofType;
    let driverProperties = interpolateSystemAssetEndpoint(driver_properties);

    const driver = await initDriver(driver_id, driverProperties);

    const data2 = await prfsApi.getSets({
      page: 0,
      set_id: setId,
    });

    if (data2.payload.prfs_sets.length < 1) {
      return;
    }

    const prfsSet = data2.payload.prfs_sets[0];

    let merkleProof = {
      root: BigInt(prfsSet.merkle_root),
      siblings,
      pathIndices,
    };

    console.log(55, merkleProof);

    const msgRaw = "harry potter";
    const msg = Buffer.from(msgRaw);
    const msgHash = hashPersonalMessage(msg);

    let sig = await signer.signMessage(msg);
    console.log("sig", sig);

    let verifyMsg = ethers.utils.verifyMessage(msg, sig);
    console.log("verified addr", verifyMsg);

    let proverAddress = await signer.getAddress();
    console.log("proverAddr", proverAddress);

    console.log("Proving...");
    console.time("Full proving time");
    const sigData = {
      msgRaw,
      msgHash,
      sig,
    };

    const { proof, publicInput } = await driver.prove2(sig, msgHash, merkleProof);
    // const { proof, publicInput } = await driver.prove({
    //   inputs: {
    //     merkleProof,
    //     sigData,
    //   },
    //   circuitType: "MERKLE_PROOF_1",
    //   eventListener: () => {},
    // });

    console.timeEnd("Full proving time");
    console.log("Raw proof size (excluding public input)", proof.length, "bytes");

    // console.log("Verifying...");

    // console.time("Verification time");
    // const result = await driver.verify(proof, publicInput.serialize());
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
  }, [publicInputInstance, selectedProofType, setFormAlert, state.prfsAccount, proofGenElement]);

  // console.log(11, selectedProofType);

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
