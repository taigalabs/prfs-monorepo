import React from "react";
import { PrfsIdCredential, QueryPresetVals } from "@taigalabs/prfs-id-sdk-web";

import styles from "./CircuitInputs.module.scss";
import { i18nContext } from "@/i18n/context";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import MerkleSigPosRangeInput from "@/components/circuit_input_items/merkle_sig_pos_range_v1/MerkleSigPosRangeInput";
import { MerkleSigPosRangeV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Data";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
import { Transmuted } from "@/components/circuit_input_items/formErrorTypes";
import AddrMembershipInput from "@/components/circuit_input_items/addr_membership_v1/AddrMembershipInput";
import { AddrMembershipV1Data } from "@taigalabs/prfs-circuit-interface/bindings/AddrMembershipV1Data";
import { AddrMembershipV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/AddrMembershipV1Inputs";
import SimpleHashInput from "@/components/circuit_input_items/simple_hash_v1/SimpleHashInput";
import { SimpleHashV1Data } from "@taigalabs/prfs-circuit-interface/bindings/SimpleHashV1Data";
import { SimpleHashV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/SimpleHashV1Inputs";

const CircuitInputs: React.FC<CircuitInputsProps> = ({
  proofType,
  formValues,
  formErrors,
  setFormValues,
  setFormErrors,
  presetVals,
  credential,
}) => {
  const i18n = React.useContext(i18nContext);

  const circuitInputsElem = React.useMemo(() => {
    switch (proofType.circuit_type_id) {
      case "merkle_sig_pos_range_v1": {
        return (
          <MerkleSigPosRangeInput
            circuitTypeData={proofType.circuit_type_data as MerkleSigPosRangeV1Data}
            value={formValues as MerkleSigPosRangeV1Inputs}
            error={formErrors as Transmuted<MerkleSigPosRangeV1Inputs>}
            setFormValues={setFormValues}
            setFormErrors={setFormErrors as any}
            presetVals={presetVals}
            credential={credential}
          />
        );
      }
      case "addr_membership_v1": {
        return (
          <AddrMembershipInput
            circuitTypeData={proofType.circuit_type_data as AddrMembershipV1Data}
            value={formValues as AddrMembershipV1Inputs}
            error={formErrors as Transmuted<AddrMembershipV1Inputs>}
            setFormValues={setFormValues}
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
            value={formValues as SimpleHashV1Inputs}
            error={formErrors as Transmuted<SimpleHashV1Inputs>}
            setFormValues={setFormValues}
            setFormErrors={setFormErrors as any}
            presetVals={presetVals}
            credential={credential}
          />
        );
      }
      default:
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
  presetVals?: QueryPresetVals;
  credential: PrfsIdCredential;
}
