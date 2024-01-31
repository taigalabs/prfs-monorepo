import React from "react";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import cn from "classnames";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import ConnectWallet from "@taigalabs/prfs-react-lib/src/connect_wallet/ConnectWallet";
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";
import { useMutation } from "@tanstack/react-query";
import { GetPrfsTreeLeafIndicesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeLeafIndicesRequest";
import { GetPrfsSetBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetBySetIdRequest";
import { GetPrfsTreeNodesByPosRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeNodesByPosRequest";
import { PrfsIdCredential, QueryPresetVals } from "@taigalabs/prfs-id-sdk-web";
import { SpartanMerkleProof } from "@taigalabs/prfs-proof-interface";

import styles from "./MerkleSigPosRange.module.scss";
// import MerkleProofRaw from "./MerkleProofRaw";
import { i18nContext } from "@/i18n/context";
import {
  FormError,
  FormInput,
  FormInputBtnRow,
  FormInputTitle,
  FormInputTitleRow,
  FormInputType,
  InputWrapper,
} from "@/components/form_input/FormInput";
import { FormInputButton } from "@/components/circuit_inputs/CircuitInputComponents";
import CachedAddressDialog from "@/components/cached_address_dialog/CachedAddressDialog";
import { LocalPrfsProofCredential } from "@/storage/local_storage";

const ComputedValue: React.FC<ComputedValueProps> = ({ value }) => {
  const val = React.useMemo(() => {
    return (
      "Root: " +
      value.root.toString().substring(0, 6) +
      "... / First sibling: " +
      value.siblings[0].toString().substring(0, 6) +
      "..."
    );
  }, [value]);

  return <div className={styles.computedValue}>{val}</div>;
};

const MerkleSigPosRangeInput: React.FC<MerkleSigPosRangeInputProps> = ({
  circuitInput,
  value,
  credential,
  error,
  setFormErrors,
  setFormValues,
  presetVals,
}) => {
  const i18n = React.useContext(i18nContext);
  const [prfsSet, setPrfsSet] = React.useState<PrfsSet>();
  const [walletAddr, setWalletAddr] = React.useState("");

  const { mutateAsync: GetPrfsTreeLeafIndices } = useMutation({
    mutationFn: (req: GetPrfsTreeLeafIndicesRequest) => {
      return prfsApi2("get_prfs_tree_leaf_indices", req);
    },
  });

  const { mutateAsync: getPrfsSetBySetId } = useMutation({
    mutationFn: (req: GetPrfsSetBySetIdRequest) => {
      return prfsApi2("get_prfs_set_by_set_id", req);
    },
  });

  const { mutateAsync: getPrfsTreeNodesByPosRequest } = useMutation({
    mutationFn: (req: GetPrfsTreeNodesByPosRequest) => {
      return prfsApi2("get_prfs_tree_nodes_by_pos", req);
    },
  });

  React.useEffect(() => {
    async function fn() {
      if (circuitInput.ref_type === "PRFS_SET") {
        if (!circuitInput.ref_value) {
          console.error("Prfs set ref value is not provided");
          return;
        }

        const { payload } = await getPrfsSetBySetId({
          set_id: circuitInput.ref_value,
        });

        if (payload) {
          setPrfsSet(payload.prfs_set);
        }
      } else {
        console.error("Prfs set not found");
      }
    }
    fn().then();
  }, [circuitInput, setPrfsSet, getPrfsSetBySetId]);

  const handleClickRawSubmit = React.useCallback(
    (merkleProof: SpartanMerkleProof) => {
      setFormValues((prevVals: any) => {
        return {
          ...prevVals,
          [circuitInput.name]: merkleProof,
        };
      });

      // setIsOpen(false);
    },
    [setFormValues],
  );

  const handleChangeAddress = React.useCallback(
    async (addr: string) => {
      if (!prfsSet) {
        return;
      }

      if (!addr) {
        return;
      }

      setWalletAddr(addr);
      setFormErrors((prevVals: any) => {
        return {
          ...prevVals,
          [circuitInput.name]: undefined,
        };
      });

      const { set_id, merkle_root } = prfsSet;

      console.log(!23, set_id, merkle_root);

      // try {
      //   const { payload, error } = await GetPrfsTreeLeafIndices({
      //     set_id,
      //     leaf_vals: [addr],
      //   });

      //   if (error) {
      //     setFormErrors((prevVals: any) => {
      //       return {
      //         ...prevVals,
      //         [circuitInput.name]: error,
      //       };
      //     });
      //   }

      //   if (!payload) {
      //     return;
      //   }

      //   let pos_w = null;
      //   // console.log("nodes", payload.prfs_tree_nodes);

      //   for (const node of payload.prfs_tree_nodes) {
      //     if (node.val === addr.toLowerCase()) {
      //       pos_w = node.pos_w;
      //     }
      //   }

      //   if (pos_w === null) {
      //     throw new Error("Address is not part of a set");
      //   }

      //   const leafIdx = Number(pos_w);
      //   const siblingPath = makeSiblingPath(32, leafIdx);
      //   const pathIndices = makePathIndices(32, leafIdx);

      //   const siblingPos = siblingPath.map((pos_w, idx) => {
      //     return { pos_h: idx, pos_w };
      //   });

      //   // console.log("leafIdx: %o, siblingPos: %o", leafIdx, siblingPos);

      //   const siblingNodesData = await getPrfsTreeNodesByPosRequest({
      //     set_id,
      //     pos: siblingPos,
      //   });

      //   if (siblingNodesData.payload === null) {
      //     throw new Error(siblingNodesData.error);
      //   }

      //   let siblings: BigInt[] = [];
      //   for (const node of siblingNodesData.payload.prfs_tree_nodes) {
      //     siblings[node.pos_h] = BigInt(node.val);
      //   }

      //   for (let idx = 0; idx < 32; idx += 1) {
      //     if (siblings[idx] === undefined) {
      //       siblings[idx] = BigInt(0);
      //     }
      //   }

      //   const merkleProof: SpartanMerkleProof = {
      //     root: BigInt(merkle_root),
      //     siblings: siblings as bigint[],
      //     pathIndices,
      //   };

      //   console.log(11, siblingNodesData, merkleProof);

      //   setFormValues((prevVals: any) => {
      //     return {
      //       ...prevVals,
      //       [circuitInput.name]: merkleProof,
      //     };
      //   });
      // } catch (err) {
      //   console.error(err);
      // }
    },
    [setWalletAddr, setFormValues, prfsSet, GetPrfsTreeLeafIndices, setFormErrors],
  );

  const label = React.useMemo(() => {
    return `${circuitInput.label} (${prfsSet ? prfsSet.label : i18n.loading})`;
  }, [circuitInput, prfsSet]);

  // const inputElem = React.useMemo(() => {
  //   if (!presetVals) {
  //     return (
  //       <div className={styles.presetValsVoid}>
  //         This proof type can only be used with preset values. Consult the host application
  //       </div>
  //     );
  //   } else {
  //     return null;
  //   }
  // }, [presetVals]);

  return (
    <FormInput>
      <FormInputTitleRow>
        {/* <FormInputType>{circuitInput.type}</FormInputType> */}
        <FormInputTitle>
          <span className={styles.inputLabel}>{label}</span>
        </FormInputTitle>
        <FormInputBtnRow>
          <CachedAddressDialog handleChangeAddress={handleChangeAddress} credential={credential}>
            <FormInputButton type="button">{i18n.fetch_addresses}</FormInputButton>
          </CachedAddressDialog>
          <span className={styles.or}> or </span>
          <ConnectWallet handleChangeAddress={handleChangeAddress}>
            <FormInputButton type="button">{i18n.connect}</FormInputButton>
          </ConnectWallet>
        </FormInputBtnRow>
      </FormInputTitleRow>
      <InputWrapper>
        <div className={styles.interactiveArea}>
          <input
            className={styles.addressInput}
            placeholder={`${circuitInput.desc}`}
            value={walletAddr}
            readOnly
          />
        </div>
      </InputWrapper>
      {value && <ComputedValue value={value} />}
      {error && <FormError>{error}</FormError>}
    </FormInput>
  );
};

export default MerkleSigPosRangeInput;

export interface MerkleSigPosRangeInputProps {
  circuitInput: CircuitInput;
  value: SpartanMerkleProof | undefined;
  error: string | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  presetVals?: QueryPresetVals;
  credential: PrfsIdCredential;
}

export interface ComputedValueProps {
  value: SpartanMerkleProof;
}
