import React from "react";
import cn from "classnames";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import ConnectWallet from "@taigalabs/prfs-react-lib/src/connect_wallet/ConnectWallet";
import {
  // deriveProofKey,
  makePathIndices,
  makeSiblingPath,
  poseidon_2_bigint_le,
} from "@taigalabs/prfs-crypto-js";
import { hexlify, toUtf8Bytes } from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { GetPrfsTreeLeafIndicesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeLeafIndicesRequest";
import { GetPrfsSetBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetBySetIdRequest";
import { GetPrfsTreeNodesByPosRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeNodesByPosRequest";
import { PrfsIdCredential, deriveProofKey, makeWalletAtstCm } from "@taigalabs/prfs-id-sdk-web";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
import { SpartanMerkleProof } from "@taigalabs/prfs-circuit-interface/bindings/SpartanMerkleProof";
import { GetPrfsSetElementRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetElementRequest";
import { PrfsSetElementData } from "@taigalabs/prfs-entities/bindings/PrfsSetElementData";
import { bytesToNumberLE } from "@taigalabs/prfs-crypto-js";
import { MerkleSigPosRangeV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Data";
import { GetLatestPrfsTreeBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetLatestPrfsTreeBySetIdRequest";
import { MerkleSigPosRangeV1PresetVals } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PresetVals";
import { PrfsTree } from "@taigalabs/prfs-entities/bindings/PrfsTree";
import { GetPrfsProofRecordRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofRecordRequest";
import { Wallet } from "@taigalabs/prfs-crypto-deps-js/ethers";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import Input from "@taigalabs/prfs-react-lib/src/input/Input";

import styles from "./MerkleSigPosRange.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  FormError,
  FormInput,
  FormInputTitle,
  FormInputTitleRow,
} from "@/components/form_input/FormInput";
import { FormInputButton } from "@/components/circuit_inputs/CircuitInputComponents";
import CachedAddressDialog from "@/components/cached_address_dialog/CachedAddressDialog";
import {
  FormErrors,
  FormHandler,
  FormValues,
  HandleSkipCreateProof,
} from "@/components/circuit_input_items/formTypes";
import { envs } from "@/envs";
import RangeSelect from "./RangeSelect";
import MemoInput from "./MemoInput";

const ComputedValue: React.FC<ComputedValueProps> = ({ value }) => {
  const val = React.useMemo(() => {
    if (value.merkleProof) {
      return (
        "Merkle root: " +
        value.merkleProof.root.toString().substring(0, 5) +
        "..., First sibling: " +
        value.merkleProof.siblings[0].toString().substring(0, 5) +
        "..."
      );
    }

    return null;
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
  setFormHandler,
  presetVals,
  proofAction,
  usePrfsRegistry,
  handleSkipCreateProof,
}) => {
  const i18n = React.useContext(i18nContext);
  const [prfsSet, setPrfsSet] = React.useState<PrfsSet>();
  const [prfsTree, setPrfsTree] = React.useState<PrfsTree>();
  const [walletAddr, setWalletAddr] = React.useState("");
  const [rangeOptionIdx, setRangeOptionIdx] = React.useState(-1);

  const { mutateAsync: getPrfsProofRecord } = useMutation({
    mutationFn: (req: GetPrfsProofRecordRequest) => {
      return prfsApi3({ type: "get_prfs_proof_record", ...req });
    },
  });

  const { mutateAsync: getPrfsSetElement } = useMutation({
    mutationFn: (req: GetPrfsSetElementRequest) => {
      return prfsApi3({ type: "get_prfs_set_element", ...req });
    },
  });

  const { isPending: isGetLatestPrfsTreePending, mutateAsync: getLatestPrfsTreeBySetId } =
    useMutation({
      mutationFn: (req: GetLatestPrfsTreeBySetIdRequest) => {
        return prfsApi3({ type: "get_latest_prfs_tree_by_set_id", ...req });
      },
    });

  const { mutateAsync: getPrfsTreeLeafIndices } = useMutation({
    mutationFn: (req: GetPrfsTreeLeafIndicesRequest) => {
      return prfsApi3({ type: "get_prfs_tree_leaf_indices", ...req });
    },
  });

  const { mutateAsync: getPrfsSetBySetId } = useMutation({
    mutationFn: (req: GetPrfsSetBySetIdRequest) => {
      return prfsApi3({ type: "get_prfs_set_by_set_id", ...req });
    },
  });

  const { mutateAsync: getPrfsTreeNodesByPosRequest } = useMutation({
    mutationFn: (req: GetPrfsTreeNodesByPosRequest) => {
      return prfsApi3({ type: "get_prfs_tree_nodes_by_pos", ...req });
    },
  });

  const labelElem = React.useMemo(() => {
    function handleClick(ev: React.MouseEvent) {
      ev.preventDefault();

      if (prfsSet) {
        const url = `${envs.NEXT_PUBLIC_PRFS_CONSOLE_WEBAPP_ENDPOINT}/sets/${prfsSet.set_id}`;
        window.parent.window.open(url);
      }
    }

    let treeId = prfsTree ? prfsTree.tree_id.substring(0, 7) : "Loading...";

    return prfsSet ? (
      <span className={styles.inputLabel}>
        <span>{prfsSet.label}</span>
        <a
          className={styles.link}
          onClick={handleClick}
          href={`${envs.NEXT_PUBLIC_PRFS_PROOF_WEBAPP_ENDPOINT}/sets/${prfsSet.set_id}`}
        >
          <span> ({treeId})</span>
        </a>
      </span>
    ) : (
      <span className={styles.inputLabel}>{i18n.loading}</span>
    );
  }, [prfsSet, prfsTree]);

  const abbrevWalletAddr = React.useMemo(() => {
    if (walletAddr.length > 10) {
      return abbrev7and5(walletAddr);
    }
    return "";
  }, [walletAddr]);

  React.useEffect(() => {
    setFormHandler(() => async (formValues: FormValues<MerkleSigPosRangeV1Inputs>) => {
      const val = formValues as MerkleSigPosRangeV1Inputs | undefined;
      if (!val) {
        setFormErrors(oldVal => ({
          ...oldVal,
          merkleProof: "Form is empty, something is wrong",
        }));
        return { isValid: false as const };
      }

      if (!val?.merkleProof) {
        setFormErrors(oldVal => ({
          ...oldVal,
          merkleProof: "Merkle proof is empty",
        }));
        return { isValid: false as const };
      }
      const { root, siblings, pathIndices } = val.merkleProof;
      if (!root || !siblings || !pathIndices) {
        setFormErrors(oldVal => ({
          ...oldVal,
          merkleProof: "Merkle path is not provided. Have you put address?",
        }));
        return { isValid: false as const };
      }
      if (!val.nonceRaw || val.nonceRaw.length === 0) {
        setFormErrors(oldVal => ({
          ...oldVal,
          nonceRaw: "Nonce raw is empty",
        }));
        return { isValid: false as const };
      }

      const { pkHex, skHex } = await deriveProofKey(credential.secret_key, val.nonceRaw);
      val.proofPubKey = skHex;

      const proofActionSigMsg = toUtf8Bytes(proofAction);
      const wallet = new Wallet(skHex);
      const sig = await wallet.signMessage(proofActionSigMsg);

      console.log("proofAction: %o, str: %o", proofAction, proofActionSigMsg);

      return {
        isValid: true,
        proofPubKey: pkHex,
        proofAction,
        proofActionSig: "0x" + sig,
        proofActionSigMsg: Array.from(proofActionSigMsg),
      };
    });
  }, [setFormHandler, setFormErrors, proofAction]);

  React.useEffect(() => {
    async function fn() {
      if (presetVals?.nonceRaw && usePrfsRegistry) {
        const { pkHex, skHex } = await deriveProofKey(credential.secret_key, presetVals.nonceRaw);
        const { payload, error } = await getPrfsProofRecord({
          public_key: pkHex,
        });

        if (error) {
        }

        if (payload) {
          if (payload.proof_record) {
            const proofActionSigMsg = toUtf8Bytes(proofAction);
            const wallet = new Wallet(skHex);
            const sig = await wallet.signMessage(proofActionSigMsg);

            // console.log("proofAction: %o, str: %o", proofAction, proofActionSigMsg);
            // console.log("sig: %s, skHex: %o, sigMsg: %o", sig, skHex, proofActionSigMsg);
            // const addr = ethers.utils.verifyMessage(proofActionSigMsg, sig);
            // const addr2 = computeAddress(pkHex);
            // console.log("addr", addr, addr2);
            // console.log("pkHex", pkHex);

            handleSkipCreateProof({
              type: "cached_prove_receipt",
              proofAction,
              proofActionSigMsg: Array.from(proofActionSigMsg),
              proofActionSig: sig,
              proofPubKey: pkHex,
            });
          }
        }
      }
    }
    fn().then();
  }, [presetVals, proofAction, getPrfsProofRecord, usePrfsRegistry, handleSkipCreateProof]);

  React.useEffect(() => {
    async function fn() {
      if (circuitTypeData) {
        if (!circuitTypeData.prfs_set_id) {
          console.error("Prfs set id is not provided");
          return;
        }

        const { payload: getPrfsSetPayload } = await getPrfsSetBySetId({
          set_id: circuitTypeData.prfs_set_id,
        });

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

        if (getPrfsSetPayload) {
          setPrfsSet(getPrfsSetPayload.prfs_set);
        }

        if (getLatestPrfsTreeBySetIdPayload?.prfs_tree) {
          setPrfsTree(getLatestPrfsTreeBySetIdPayload.prfs_tree);
        }
      } else {
        console.error("Prfs set not found");
      }
    }
    fn().then();
  }, [circuitTypeData, setPrfsSet, getPrfsSetBySetId, setPrfsTree]);

  const handleChangeAddress = React.useCallback(
    async (addr: string) => {
      if (!prfsSet) {
        return;
      }
      if (!prfsTree) {
        return;
      }
      if (!addr) {
        return;
      }

      setWalletAddr(addr);
      setFormErrors(prevVals => {
        return {
          ...prevVals,
          merkleProof: undefined,
        };
      });

      const { set_id } = prfsSet;
      const { range_data } = circuitTypeData;
      if (!range_data) {
        setFormErrors(prevVals => {
          return {
            ...prevVals,
            merkleProof: "range_data is empty",
          };
        });
        return;
      }

      try {
        // Merkle setup
        const { payload: getPrfsSetElementPayload } = await getPrfsSetElement({
          set_id,
          label: addr,
        });

        if (!getPrfsSetElementPayload) {
          function handleClick() {
            const url = `${envs.NEXT_PUBLIC_PRFS_CONSOLE_WEBAPP_ENDPOINT}/sets/${set_id}`;
            window.parent.window.open(url);
          }

          const elem = (
            <div>
              <span>
                This address doesn't exist in {prfsSet.label}. Choose a different one or{" "}
                <button type="button" onClick={handleClick} className={styles.link}>
                  add yours
                </button>{" "}
                to the set
              </span>
            </div>
          );

          setFormErrors(oldVal => ({
            ...oldVal,
            merkleProof: elem,
          }));
          throw new Error("no payload from prfs set element");
        }

        const data = getPrfsSetElementPayload.prfs_set_element
          ?.data as unknown as PrfsSetElementData[];

        if (data.length !== 2) {
          throw new Error("Only data of cardinality 2 is currently supported");
        }

        const args: bigint[] = [];
        await (async () => {
          const d = data[0];
          switch (d.type) {
            case "WalletCm": {
              const { hashed } = await makeWalletAtstCm(credential.secret_key, addr);
              const cm = hexlify(hashed);
              const cmInt = bytesToNumberLE(hashed);

              if (d.val !== cm) {
                throw new Error(`Commitment does not match, addr: ${addr}`);
              }

              args[0] = cmInt;
              break;
            }
            default:
              throw new Error("Unsupported data type for the first element");
          }
        })();

        (() => {
          const d = data[1];
          switch (d.type) {
            case "Int": {
              args[1] = BigInt(d.val);
              break;
            }
            default:
              throw new Error("Unsupported data type for the second element");
          }
        })();

        const leafBytes = await poseidon_2_bigint_le(args);
        const leafVal = bytesToNumberLE(leafBytes);
        console.log("leafBytes: %o, args: %s, leafVal: %s, ", leafBytes, args, leafVal);

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
          return;
        }

        if (!payload) {
          setFormErrors((prevVals: any) => {
            return {
              ...prevVals,
              merkleProof: "Get Prfs Tree Leaf Indices failed",
            };
          });
          return;
        }

        if (payload.prfs_tree_nodes.length < 1) {
          setFormErrors((prevVals: any) => {
            return {
              ...prevVals,
              merkleProof: `${addr} is not part of a ${set_id}`,
            };
          });
          return;
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
          root: BigInt(prfsTree.merkle_root),
          siblings: siblings as bigint[],
          pathIndices,
        };

        // Range setup
        let optionIdx = -1;
        for (const [idx, option] of range_data.options.entries()) {
          const { lower_bound, upper_bound } = option;
          if (lower_bound <= args[1] && args[1] < upper_bound) {
            optionIdx = idx;
          }
        }

        if (optionIdx === -1) {
          throw new Error("Value does not match any options");
        }
        setRangeOptionIdx(optionIdx);

        const option = range_data.options[optionIdx];
        if (!option) {
          throw new Error(`Option at index does not exist, idx: ${optionIdx}`);
        }
        const { lower_bound, upper_bound, label } = option;

        setFormValues(oldVal => ({
          ...oldVal,
          sigpos: args[0],
          leaf: leafVal,
          assetSize: args[1],
          assetSizeGreaterEqThan: lower_bound,
          assetSizeLessThan: upper_bound,
          assetSizeLabel: label,
          merkleProof,
          proofAction,
        }));
      } catch (err) {
        console.error(err);
      }
    },
    [
      setWalletAddr,
      setFormValues,
      prfsSet,
      getPrfsTreeLeafIndices,
      getLatestPrfsTreeBySetId,
      setFormErrors,
      getPrfsSetElement,
      setRangeOptionIdx,
      prfsTree,
      proofAction,
    ],
  );

  return (
    <>
      <FormInput>
        <FormInputTitleRow>
          <FormInputTitle>{labelElem}</FormInputTitle>
        </FormInputTitleRow>
        <div className={styles.addrInputWrapper}>
          <Input
            inputClassName={styles.addrInput}
            labelClassName={styles.addrInput}
            name={""}
            label={i18n.wallet}
            value={abbrevWalletAddr}
            readOnly
          />
          <div className={styles.btnRow}>
            <CachedAddressDialog handleChangeAddress={handleChangeAddress}>
              <FormInputButton type="button">{i18n.cache}</FormInputButton>
            </CachedAddressDialog>
            <span className={styles.or}> or </span>
            <ConnectWallet handleChangeAddress={handleChangeAddress}>
              <FormInputButton type="button">{i18n.connect}</FormInputButton>
            </ConnectWallet>
          </div>
        </div>
        <div className={styles.row}>
          <MemoInput
            value={value}
            presetVals={presetVals}
            circuitTypeData={circuitTypeData}
            setFormValues={setFormValues}
            setFormErrors={setFormErrors}
            error={error}
          />
        </div>
        {error?.merkleProof && <FormError>{error.merkleProof}</FormError>}
        <RangeSelect circuitTypeData={circuitTypeData} rangeOptionIdx={rangeOptionIdx} />
        {value && <ComputedValue value={value} />}
      </FormInput>
    </>
  );
};

export default MerkleSigPosRangeInput;

export interface MerkleSigPosRangeInputProps {
  circuitTypeData: MerkleSigPosRangeV1Data;
  value: FormValues<MerkleSigPosRangeV1Inputs>;
  error: FormErrors<MerkleSigPosRangeV1Inputs>;
  setFormValues: React.Dispatch<React.SetStateAction<MerkleSigPosRangeV1Inputs>>;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors<MerkleSigPosRangeV1Inputs>>>;
  setFormHandler: React.Dispatch<React.SetStateAction<FormHandler | null>>;
  presetVals?: MerkleSigPosRangeV1PresetVals;
  credential: PrfsIdCredential;
  proofAction: string;
  usePrfsRegistry?: boolean;
  handleSkipCreateProof: HandleSkipCreateProof;
}

export interface ComputedValueProps {
  value: FormValues<MerkleSigPosRangeV1Inputs>;
}
