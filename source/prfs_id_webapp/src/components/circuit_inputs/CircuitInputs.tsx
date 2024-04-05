import React from "react";
import { PrfsIdCredential, QueryPresetVals } from "@taigalabs/prfs-id-sdk-web";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { MerkleSigPosRangeV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Data";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
import { AddrMembershipV1Data } from "@taigalabs/prfs-circuit-interface/bindings/AddrMembershipV1Data";
import { AddrMembershipV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/AddrMembershipV1Inputs";
import { SimpleHashV1Data } from "@taigalabs/prfs-circuit-interface/bindings/SimpleHashV1Data";
import { SimpleHashV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/SimpleHashV1Inputs";
import { MerkleSigPosRangeV1PresetVals } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PresetVals";

import styles from "./CircuitInputs.module.scss";
import MerkleSigPosRangeInput from "@/components/circuit_input_items/merkle_sig_pos_range_v1/MerkleSigPosRangeInput";
import {
  FormErrors,
  FormHandler,
  FormValues,
  HandleSkipCreateProof,
} from "@/components/circuit_input_items/formTypes";
import AddrMembershipInput from "@/components/circuit_input_items/addr_membership_v1/AddrMembershipInput";
import SimpleHashInput from "@/components/circuit_input_items/simple_hash_v1/SimpleHashInput";
import MerkleSigPosExactInput from "@/components/circuit_input_items/merkle_sig_pos_exact_v1/MerkleSigPosExactInput";

const CircuitInputs: React.FC<CircuitInputsProps> = ({
  proofType,
  formValues,
  formErrors,
  setFormValues,
  setFormErrors,
  setFormHandler,
  presetVals,
  credential,
  proofAction,
  usePrfsRegistry,
  handleSkipCreateProof,
}) => {
  const circuitInputsElem = React.useMemo(() => {
    switch (proofType.circuit_type_id) {
      case "merkle_sig_pos_range_v1": {
        return (
          <MerkleSigPosRangeInput
            circuitTypeData={proofType.circuit_type_data as MerkleSigPosRangeV1Data}
            value={formValues as FormValues<MerkleSigPosRangeV1Inputs>}
            error={formErrors as FormErrors<MerkleSigPosRangeV1Inputs>}
            setFormValues={setFormValues}
            setFormErrors={setFormErrors as any}
            setFormHandler={setFormHandler}
            presetVals={presetVals as MerkleSigPosRangeV1PresetVals}
            credential={credential}
            proofAction={proofAction}
            usePrfsRegistry={usePrfsRegistry}
            handleSkipCreateProof={handleSkipCreateProof}
          />
        );
      }
      case "addr_membership_v1": {
        return (
          <AddrMembershipInput
            circuitTypeData={proofType.circuit_type_data as AddrMembershipV1Data}
            value={formValues as FormValues<AddrMembershipV1Inputs>}
            error={formErrors as FormErrors<AddrMembershipV1Inputs>}
            setFormValues={setFormValues}
            setFormHandler={setFormHandler}
            setFormErrors={setFormErrors as any}
            presetVals={presetVals}
            credential={credential}
          />
        );
      }
      case "simple_hash_v1": {
        return (
          <SimpleHashInput
            circuitTypeData={proofType.circuit_type_data as SimpleHashV1Data}
            value={formValues as FormValues<SimpleHashV1Inputs>}
            error={formErrors as FormErrors<SimpleHashV1Inputs>}
            setFormValues={setFormValues}
            setFormHandler={setFormHandler}
            setFormErrors={setFormErrors as any}
            presetVals={presetVals}
            credential={credential}
          />
        );
      }
      case "merkle_sig_pos_exact_v1": {
        return (
          <MerkleSigPosExactInput
            circuitTypeData={proofType.circuit_type_data as MerkleSigPosRangeV1Data}
            value={formValues as FormValues<MerkleSigPosRangeV1Inputs>}
            error={formErrors as FormErrors<MerkleSigPosRangeV1Inputs>}
            setFormValues={setFormValues}
            setFormErrors={setFormErrors as any}
            setFormHandler={setFormHandler}
            presetVals={presetVals as MerkleSigPosRangeV1PresetVals}
            credential={credential}
            proofAction={proofAction}
            usePrfsRegistry={usePrfsRegistry}
            handleSkipCreateProof={handleSkipCreateProof}
          />
        );
      }
      default:
        console.error(
          "Cannot handle circuit input of this type, type: %s",
          proofType.circuit_type_id,
        );
        return null;
    }
  }, [proofType, formValues, setFormValues, formErrors]);

  return <>{circuitInputsElem}</>;
};

export default CircuitInputs;

export interface CircuitInputsProps {
  proofType: PrfsProofType;
  formValues: Record<string, any>;
  formErrors: Record<string, string>;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setFormHandler: React.Dispatch<React.SetStateAction<FormHandler | null>>;
  presetVals?: QueryPresetVals;
  proofAction: string;
  credential: PrfsIdCredential;
  usePrfsRegistry?: boolean;
  handleSkipCreateProof: HandleSkipCreateProof;
}
