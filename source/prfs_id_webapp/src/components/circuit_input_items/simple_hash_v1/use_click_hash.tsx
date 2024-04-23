import React from "react";
import { SimpleHashV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/SimpleHashV1Inputs";
import { bytesLeToBigInt, poseidon_2_bigint_le } from "@taigalabs/prfs-crypto-js";
import { stringToBigInt } from "@taigalabs/prfs-crypto-js";

import { FormErrors, FormValues } from "@/components/circuit_input_items/formTypes";

export function useClickHash({ value, setFormValues, setFormErrors }: UseClickHashArgs) {
  return React.useCallback(async () => {
    if (value.hashData?.msgRaw) {
      const msgRaw = value.hashData.msgRaw;
      const msgRawInt = stringToBigInt(msgRaw);
      const bytes = await poseidon_2_bigint_le([msgRawInt, BigInt(0)]);
      const msgHash = bytesLeToBigInt(bytes);

      setFormValues(oldVals => ({
        ...oldVals,
        hashData: {
          msgRaw,
          msgRawInt,
          msgHash,
        },
      }));
    } else {
      const hashDataError = <span>Type some input to get hash result</span>;

      setFormErrors((oldVals: any) => ({
        ...oldVals,
        hashData: hashDataError,
      }));
    }
  }, [value, setFormValues]);
}

export interface UseClickHashArgs {
  value: FormValues<SimpleHashV1Inputs>;
  setFormValues: React.Dispatch<React.SetStateAction<SimpleHashV1Inputs>>;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors<SimpleHashV1Inputs>>>;
}
