import React from "react";
import cn from "classnames";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import ConnectWallet from "@taigalabs/prfs-react-lib/src/connect_wallet/ConnectWallet";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";
import {
  makePathIndices,
  makeSiblingPath,
  poseidon_2,
  poseidon_2_bigint_le,
  prfsSign,
} from "@taigalabs/prfs-crypto-js";
import { hexlify } from "ethers/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { GetPrfsTreeLeafIndicesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeLeafIndicesRequest";
import { GetPrfsSetBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetBySetIdRequest";
import { GetPrfsTreeNodesByPosRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeNodesByPosRequest";
import {
  PRFS_ATTESTATION_STEM,
  PrfsIdCredential,
  QueryPresetVals,
} from "@taigalabs/prfs-id-sdk-web";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
import { SpartanMerkleProof } from "@taigalabs/prfs-circuit-interface/bindings/SpartanMerkleProof";
import { GetPrfsSetElementRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetElementRequest";
import { PrfsSetElementData } from "@taigalabs/prfs-entities/bindings/PrfsSetElementData";
import { bytesToNumberLE } from "@taigalabs/prfs-crypto-js";
import { MerkleSigPosRangeV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Data";

import styles from "./MerkleSigPosRange.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  FormError,
  FormInput,
  FormInputBtnRow,
  FormInputTitle,
  FormInputTitleRow,
  InputWrapper,
} from "@/components/form_input/FormInput";
import { FormInputButton } from "@/components/circuit_inputs/CircuitInputComponents";
import CachedAddressDialog from "@/components/cached_address_dialog/CachedAddressDialog";
import { FormErrors, FormValues } from "@/components/circuit_input_items/formErrorTypes";
import { envs } from "@/envs";
import RangeSelect from "./RangeSelect";

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
}) => {
  const i18n = React.useContext(i18nContext);
  const [prfsSet, setPrfsSet] = React.useState<PrfsSet>();
  const [walletAddr, setWalletAddr] = React.useState("");
  const [rangeOptionIdx, setRangeOptionIdx] = React.useState(-1);

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

  const labelElem = React.useMemo(() => {
    function handleClick(ev: React.MouseEvent) {
      ev.preventDefault();

      if (prfsSet) {
        const url = `${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/sets/${prfsSet.set_id}`;
        window.parent.window.open(url);
      }
    }

    return prfsSet ? (
      <span className={styles.inputLabel}>
        <span>{i18n.member} - </span>
        <a
          className={styles.link}
          onClick={handleClick}
          href={`${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}/sets/${prfsSet.set_id}`}
        >
          <span>{prfsSet.label}</span>
          <BiLinkExternal />
        </a>
      </span>
    ) : (
      <span className={styles.inputLabel}>{i18n.loading}</span>
    );
  }, [prfsSet]);

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
      setFormErrors(prevVals => {
        return {
          ...prevVals,
          merkleProof: undefined,
        };
      });

      const { set_id, merkle_root } = prfsSet;
      try {
        const { range_data } = circuitTypeData;
        if (!range_data) {
          throw new Error("range_data is empty");
        }

        // Merkle setup
        const { payload: getPrfsSetElementPayload } = await getPrfsSetElement({
          set_id,
          label: addr,
        });

        if (!getPrfsSetElementPayload) {
          function handleClick() {
            const url = `${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/sets/${set_id}`;
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

        let sigUpper: bigint = BigInt(0);
        let sigLower: bigint = BigInt(0);
        const args: bigint[] = [];
        await (async () => {
          const d = data[0];
          switch (d.type) {
            case "WalletCm": {
              const _sig = await prfsSign(credential.secret_key, `${PRFS_ATTESTATION_STEM}${addr}`);
              const sigBytes = _sig.toCompactRawBytes();
              const hashed = await poseidon_2(sigBytes);
              const cm = hexlify(hashed);

              if (d.val !== cm) {
                throw new Error(`Commitment does not match, addr: ${addr}`);
              }

              sigUpper = bytesToNumberLE(sigBytes.subarray(0, 32));
              sigLower = bytesToNumberLE(sigBytes.subarray(32, 64));
              const cmByBigInt = await poseidon_2_bigint_le([sigUpper, sigLower]);
              const val = bytesToNumberLE(cmByBigInt);
              const val2 = bytesToNumberLE(hashed);

              if (val !== val2) {
                throw new Error(
                  `Commitment does not match, cmByBigInt: ${val}, cmByBytes: ${val2}`,
                );
              }
              args[0] = val;
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
        const { lower_bound, upper_bound } = option;

        // Nonce and pubkey setup
        // nonce: bigint;
        // ephemeralPubKeyX: bigint;
        // serialNo: bigint;
        // pubKeySerialNo: bigint;
        const nonces = [BigInt(0)];

        const formValues: MerkleSigPosRangeV1Inputs = {
          sigUpper,
          sigLower,
          leaf: leafVal,
          assetSize: args[1],
          assetSizeGreaterEqThan: lower_bound,
          assetSizeLessThan: upper_bound,
          merkleProof,
          nonces: [],
        };
        console.log("formValues: %o", formValues);

        setFormValues(formValues);
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
      setRangeOptionIdx,
    ],
  );

  return (
    <FormInput>
      <FormInputTitleRow>
        {/* <FormInputType>{circuitInput.type}</FormInputType> */}
        <FormInputTitle>{labelElem}</FormInputTitle>
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
      <div className={styles.inputGroup}>
        <InputWrapper>
          <input
            className={styles.addressInput}
            placeholder={i18n.element_of_a_group}
            value={walletAddr}
            readOnly
          />
        </InputWrapper>
        <RangeSelect circuitTypeData={circuitTypeData} rangeOptionIdx={rangeOptionIdx} />
      </div>
      {value && <ComputedValue value={value} />}
      {error?.merkleProof && <FormError>{error.merkleProof}</FormError>}
    </FormInput>
  );
};

export default MerkleSigPosRangeInput;

export interface MerkleSigPosRangeInputProps {
  circuitTypeData: MerkleSigPosRangeV1Data;
  value: FormValues<MerkleSigPosRangeV1Inputs>;
  error: FormErrors<MerkleSigPosRangeV1Inputs>;
  setFormValues: React.Dispatch<React.SetStateAction<MerkleSigPosRangeV1Inputs>>;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors<MerkleSigPosRangeV1Inputs>>>;
  presetVals?: QueryPresetVals;
  credential: PrfsIdCredential;
}

export interface ComputedValueProps {
  value: FormValues<MerkleSigPosRangeV1Inputs>;
}
