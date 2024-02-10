import React from "react";
import cn from "classnames";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import ConnectWallet from "@taigalabs/prfs-react-lib/src/connect_wallet/ConnectWallet";
import {
  makeCommitment,
  makePathIndices,
  makeSiblingPath,
  poseidon_2_bigint,
} from "@taigalabs/prfs-crypto-js";
import { useMutation } from "@tanstack/react-query";
import { GetPrfsTreeLeafIndicesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeLeafIndicesRequest";
import { GetPrfsSetBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetBySetIdRequest";
import { GetPrfsTreeNodesByPosRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeNodesByPosRequest";
import {
  PRFS_ATTESTATION_STEM,
  PrfsIdCredential,
  QueryPresetVals,
} from "@taigalabs/prfs-id-sdk-web";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface";
import { SpartanMerkleProof } from "@taigalabs/prfs-circuit-interface/bindings/SpartanMerkleProof";
import { GetPrfsSetElementRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetElementRequest";
import { PrfsSetElementData } from "@taigalabs/prfs-entities/bindings/PrfsSetElementData";
import { bytesToNumberLE, hexToNumber } from "@taigalabs/prfs-crypto-js";
import { MerkleSigPosRangeV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Data";

import styles from "./MerkleSigPosRange.module.scss";
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
import { Transmuted } from "@/components/circuit_types/formErrorTypes";

const ComputedValue: React.FC<ComputedValueProps> = ({ value }) => {
  const val = React.useMemo(() => {
    return (
      "Merkle root: " +
      value.root.toString().substring(0, 5) +
      "..., First sibling: " +
      value.siblings[0].toString().substring(0, 5) +
      "..."
    );
  }, [value]);

  return <div className={styles.computedValue}>{val}</div>;
};

const MerkleSigPosRangeInput: React.FC<MerkleSigPosRangeInputProps> = ({
  circuitTypeData,
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

  const { mutateAsync: getPrfsSetElement } = useMutation({
    mutationFn: (req: GetPrfsSetElementRequest) => {
      return prfsApi2("get_prfs_set_element", req);
    },
  });

  const { mutateAsync: getPrfsTreeLeafIndices } = useMutation({
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
      if (circuitTypeData) {
        if (!circuitTypeData.prfs_set_id) {
          console.error("Prfs set id is not provided");
          return;
        }

        const { payload } = await getPrfsSetBySetId({
          set_id: circuitTypeData.prfs_set_id,
        });

        if (payload) {
          setPrfsSet(payload.prfs_set);
        }
      } else {
        console.error("Prfs set not found");
      }
    }
    fn().then();
  }, [circuitTypeData, setPrfsSet, getPrfsSetBySetId]);

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
          merkleProof: undefined,
        };
      });

      const { set_id, merkle_root } = prfsSet;
      try {
        // let leafVal = addr;
        const { payload: getPrfsSetElementPayload } = await getPrfsSetElement({
          set_id,
          label: addr,
        });

        if (!getPrfsSetElementPayload) {
          throw new Error("no payload from prfs set element");
        }

        const data = getPrfsSetElementPayload.prfs_set_element
          ?.data as unknown as PrfsSetElementData[];

        if (data.length > 2) {
          throw new Error("Data of cardinality over 2 is currently not supported");
        }

        let args = [BigInt(0), BigInt(0)];
        for (let idx = 0; idx < data.length; idx += 1) {
          const d = data[idx];
          switch (d.type) {
            case "WalletCm": {
              const cm = await makeCommitment(
                credential.secret_key,
                `${PRFS_ATTESTATION_STEM}${addr}`,
              );

              if (d.val !== cm) {
                throw new Error(`Commitment does not match, addr: ${addr}`);
              }

              const val = hexToNumber(cm.substring(2));
              console.log("cm: %s, val: %s", cm, val);
              args[idx] = val;
              break;
            }

            case "Int": {
              args[idx] = BigInt(d.val);
              break;
            }
          }
        }

        const _leaf = await poseidon_2_bigint(args);
        const leafVal = bytesToNumberLE(_leaf);
        console.log("args: %s, poseidon: %s, ", args, leafVal);

        const { payload, error } = await getPrfsTreeLeafIndices({
          set_id,
          leaf_vals: [leafVal.toString()],
        });

        if (error) {
          setFormErrors((prevVals: any) => {
            return {
              ...prevVals,
              merkleProof: error,
            };
          });
        }

        if (!payload) {
          throw new Error("Get Prfs Tree Leaf Indices failed");
        }

        if (payload.prfs_tree_nodes.length < 1) {
          throw new Error("Empty tree nodes response");
        }

        let pos_w = payload.prfs_tree_nodes[0].pos_w;
        if (!pos_w) {
          throw new Error("'pos_w' shouldn't be empty");
        }

        const leafIdx = Number(pos_w);
        const siblingPath = makeSiblingPath(32, leafIdx);
        const pathIndices = makePathIndices(32, leafIdx);

        const siblingPos = siblingPath.map((pos_w, idx) => {
          return { pos_h: idx, pos_w };
        });

        console.log("leafIdx: %o, siblingPos: %o", leafIdx, siblingPos);

        const siblingNodesData = await getPrfsTreeNodesByPosRequest({
          set_id,
          pos: siblingPos,
        });

        if (siblingNodesData.payload === null) {
          throw new Error(siblingNodesData.error);
        }

        let siblings: BigInt[] = [];
        for (const node of siblingNodesData.payload.prfs_tree_nodes) {
          siblings[node.pos_h] = BigInt(node.val);
        }

        for (let idx = 0; idx < 32; idx += 1) {
          if (siblings[idx] === undefined) {
            siblings[idx] = BigInt(0);
          }
        }

        const merkleProof: SpartanMerkleProof = {
          root: BigInt(merkle_root),
          siblings: siblings as bigint[],
          pathIndices,
        };
        console.log("merkleProof: %o", merkleProof);

        setFormValues(() => {
          return {
            leaf: leafVal,
            asset_size: BigInt(1),
            asset_size_max_limit: BigInt(5),
            merkleProof,
          };
        });
      } catch (err) {
        console.error(err);
      }
    },
    [
      setWalletAddr,
      setFormValues,
      prfsSet,
      getPrfsTreeLeafIndices,
      setFormErrors,
      getPrfsSetElement,
    ],
  );

  const label = React.useMemo(() => {
    return `${circuitTypeData.label} (${prfsSet ? prfsSet.label : i18n.loading})`;
  }, [circuitTypeData, prfsSet]);

  return (
    <FormInput>
      <FormInputTitleRow>
        {/* <FormInputType>{circuitInput.type}</FormInputType> */}
        <FormInputTitle>
          <span className={styles.inputLabel}>{label}</span>
        </FormInputTitle>
        <FormInputBtnRow>
          <CachedAddressDialog handleChangeAddress={handleChangeAddress}>
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
            placeholder={`${circuitTypeData.desc}`}
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
  circuitTypeData: MerkleSigPosRangeV1Data;
  value: SpartanMerkleProof | undefined;
  error: string | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<MerkleSigPosRangeV1Inputs>>;
  setFormErrors: React.Dispatch<React.SetStateAction<Transmuted<MerkleSigPosRangeV1Inputs>>>;
  presetVals?: QueryPresetVals;
  credential: PrfsIdCredential;
}

export interface ComputedValueProps {
  value: SpartanMerkleProof;
}
