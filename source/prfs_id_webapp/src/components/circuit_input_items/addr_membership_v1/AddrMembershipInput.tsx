import React from "react";
import cn from "classnames";
import { prfsApi3, treeApi } from "@taigalabs/prfs-api-js";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import ConnectWallet from "@taigalabs/prfs-react-lib/src/connect_wallet/ConnectWallet";
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { GetPrfsTreeLeafIndicesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeLeafIndicesRequest";
import { GetPrfsSetBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetBySetIdRequest";
import { GetPrfsTreeNodesByPosRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeNodesByPosRequest";
import { PrfsIdCredential, QueryPresetVals } from "@taigalabs/prfs-id-sdk-web";
import { SpartanMerkleProof } from "@taigalabs/prfs-circuit-interface/bindings/SpartanMerkleProof";
import { AddrMembershipV1Data } from "@taigalabs/prfs-circuit-interface/bindings/AddrMembershipV1Data";
import { AddrMembershipV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/AddrMembershipV1Inputs";
import { GetLatestPrfsTreeBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetLatestPrfsTreeBySetIdRequest";
import { PrfsTree } from "@taigalabs/prfs-entities/bindings/PrfsTree";

import styles from "./MerkleProofInput.module.scss";
import MerkleProofRaw from "./MerkleProofRaw";
import { i18nContext } from "@/i18n/context";
import MerkleProofInput from "./MerkleProofInput";
import { FormErrors, FormHandler, FormValues } from "@/components/circuit_input_items/formTypes";
import SigDataInput from "./SigDataInput";

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

const AddrMembershipInput: React.FC<MerkleProofInputProps> = ({
  circuitTypeData,
  value,
  error,
  setFormErrors,
  setFormHandler,
  setFormValues,
  credential,
}) => {
  const i18n = React.useContext(i18nContext);
  const [prfsSet, setPrfsSet] = React.useState<PrfsSet>();
  const [prfsTree, setPrfsTree] = React.useState<PrfsTree>();
  const [walletAddr, setWalletAddr] = React.useState("");

  const { mutateAsync: GetPrfsTreeLeafIndices } = useMutation({
    mutationFn: (req: GetPrfsTreeLeafIndicesRequest) => {
      return treeApi({ type: "get_prfs_tree_leaf_indices", ...req });
    },
  });

  const { mutateAsync: getPrfsSetBySetId } = useMutation({
    mutationFn: (req: GetPrfsSetBySetIdRequest) => {
      return prfsApi3({ type: "get_prfs_set_by_set_id", ...req });
    },
  });

  const { mutateAsync: getPrfsTreeNodesByPosRequest } = useMutation({
    mutationFn: (req: GetPrfsTreeNodesByPosRequest) => {
      return treeApi({ type: "get_prfs_tree_nodes_by_pos", ...req });
    },
  });

  const { isPending: isGetLatestPrfsTreePending, mutateAsync: getLatestPrfsTreeBySetId } =
    useMutation({
      mutationFn: (req: GetLatestPrfsTreeBySetIdRequest) => {
        return treeApi({ type: "get_latest_prfs_tree_by_set_id", ...req });
      },
    });

  React.useEffect(() => {
    setFormHandler(() => async (formValues: FormValues<AddrMembershipV1Inputs>) => {
      const val = formValues as AddrMembershipV1Inputs | undefined;

      if (!val?.merkleProof) {
        setFormErrors(oldVal => ({
          ...oldVal,
          merkleProof: "Merkle proof is empty",
        }));
        return { isValid: false as const };
      } else {
        const { root, siblings, pathIndices } = val.merkleProof;

        if (!root || !siblings || !pathIndices) {
          setFormErrors(oldVal => ({
            ...oldVal,
            merkleProof: "Merkle path is not provided",
          }));
          return { isValid: false as const };
        }
      }

      if (!val?.sigData) {
        setFormErrors(oldVal => ({
          ...oldVal,
          sigData: "Input is empty",
        }));
        return { isValid: false as const };
      } else {
        const { sig, msgHash, msgRaw } = val.sigData;

        if (!sig || !msgHash || !msgRaw) {
          setFormErrors(oldVal => ({
            ...oldVal,
            sigData: "Signature is not provided. Have you signed?",
          }));
          return { isValid: false as const };
        }
      }

      return {
        isValid: true,
        proofPubKey: "",
        proofAction: "",
        proofActionSig: "",
        proofActionSigMsg: new Uint8Array(),
      };
    });
  }, [setFormHandler, setFormErrors]);

  React.useEffect(() => {
    async function fn() {
      const { payload: getLatestPrfsTreeBySetIdPayload } = await getLatestPrfsTreeBySetId({
        set_id: circuitTypeData.prfs_set_id,
      });

      if (!isGetLatestPrfsTreePending && getLatestPrfsTreeBySetIdPayload?.prfs_tree === null) {
        setFormErrors(prevVals => {
          return {
            ...prevVals,
            merkleProof: "Tree does not exist",
          };
        });
        return;
      }
      if (getLatestPrfsTreeBySetIdPayload?.prfs_tree) {
        setPrfsTree(getLatestPrfsTreeBySetIdPayload.prfs_tree);
      }
      // if (circuitInput.ref_type === "PRFS_SET") {
      //   if (!circuitInput.ref_value) {
      //     console.error("Prfs set ref value is not provided");
      //     return;
      //   }
      //   const { payload } = await getPrfsSetBySetId({
      //     set_id: circuitInput.ref_value,
      //   });
      //   if (payload) {
      //     setPrfsSet(payload.prfs_set);
      //   }
      // } else {
      //   console.error("Prfs set not found");
      // }
    }
    fn().then();
  }, [circuitTypeData, setPrfsSet, getPrfsSetBySetId, setPrfsTree]);

  const handleClickRawSubmit = React.useCallback(
    (merkleProof: SpartanMerkleProof) => {
      setFormValues((prevVals: any) => {
        return {
          ...prevVals,
          merkleProof: merkleProof,
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

      if (!prfsTree) {
        return;
      }

      setWalletAddr(addr);
      setFormErrors((prevVals: any) => {
        return {
          ...prevVals,
          merkleProof: undefined,
        };
      });

      const { set_id } = prfsSet;

      try {
        const { payload, error } = await GetPrfsTreeLeafIndices({
          tree_id: prfsTree.tree_id,
          leaf_vals: [addr],
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
          return;
        }

        let pos_w = null;
        // console.log("nodes", payload.prfs_tree_nodes);

        for (const node of payload.prfs_tree_nodes) {
          if (node.val === addr.toLowerCase()) {
            pos_w = node.pos_w;
          }
        }

        if (pos_w === null) {
          throw new Error("Address is not part of a set");
        }

        const leafIdx = Number(pos_w);
        const siblingPath = makeSiblingPath(32, leafIdx);
        const pathIndices = makePathIndices(32, leafIdx);

        const siblingPos = siblingPath.map((pos_w, idx) => {
          return { pos_h: idx, pos_w };
        });

        // console.log("leafIdx: %o, siblingPos: %o", leafIdx, siblingPos);

        const siblingNodesData = await getPrfsTreeNodesByPosRequest({
          tree_id: prfsTree.tree_id,
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
          root: BigInt(prfsTree.merkle_root),
          siblings: siblings as bigint[],
          pathIndices,
        };

        setFormValues((prevVals: any) => {
          return {
            ...prevVals,
            merkleProof: merkleProof,
          };
        });
      } catch (err) {
        console.error(err);
      }
    },
    [setWalletAddr, setFormValues, prfsSet, GetPrfsTreeLeafIndices, setFormErrors, prfsTree],
  );

  const label = React.useMemo(() => {
    return `Membership (${prfsSet ? prfsSet.label : i18n.loading})`;
  }, [circuitTypeData, prfsSet]);

  return (
    <>
      <MerkleProofInput
        circuitTypeData={circuitTypeData}
        value={value}
        error={error}
        setFormErrors={setFormErrors}
        setFormValues={setFormValues}
      />
      <SigDataInput
        circuitTypeData={circuitTypeData}
        value={value}
        error={error}
        setFormErrors={setFormErrors}
        setFormValues={setFormValues}
        credential={credential}
      />

      {/* <FormInput> */}
      {/*   <FormInputTitleRow> */}
      {/*     <FormInputTitle> */}
      {/*       <span className={styles.inputLabel}>{label}</span> */}
      {/*     </FormInputTitle> */}
      {/*     <FormInputBtnRow> */}
      {/*       <ConnectWallet handleChangeAddress={handleChangeAddress}> */}
      {/*         <FormInputButton type="button">{i18n.connect}</FormInputButton> */}
      {/*       </ConnectWallet> */}
      {/*       <span className={styles.or}> or </span> */}
      {/*       <MerkleProofRaw */}
      {/*         circuitTypeData={circuitTypeData} */}
      {/*         prfsSet={prfsSet} */}
      {/*         handleClickRawSubmit={handleClickRawSubmit} */}
      {/*       > */}
      {/*         <FormInputButton type="button">{i18n.edit_raw}</FormInputButton> */}
      {/*       </MerkleProofRaw> */}
      {/*     </FormInputBtnRow> */}
      {/*   </FormInputTitleRow> */}
      {/*   <InputWrapper> */}
      {/*     <div className={styles.interactiveArea}> */}
      {/*       <input */}
      {/*         className={styles.addressInput} */}
      {/*         placeholder={`Wallet address`} */}
      {/*         value={walletAddr} */}
      {/*         readOnly */}
      {/*       /> */}
      {/*     </div> */}
      {/*   </InputWrapper> */}
      {/*   {value && <ComputedValue value={value} />} */}
      {/*   {error && <FormError>{error}</FormError>} */}
      {/* </FormInput> */}
    </>
  );
};

export default AddrMembershipInput;

export interface MerkleProofInputProps {
  circuitTypeData: AddrMembershipV1Data;
  value: FormValues<AddrMembershipV1Inputs>;
  error: FormErrors<AddrMembershipV1Inputs>;
  setFormValues: React.Dispatch<React.SetStateAction<AddrMembershipV1Inputs>>;
  setFormHandler: React.Dispatch<React.SetStateAction<FormHandler | null>>;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors<AddrMembershipV1Inputs>>>;
  presetVals?: QueryPresetVals;
  credential: PrfsIdCredential;
}

export interface ComputedValueProps {
  value: SpartanMerkleProof;
}
