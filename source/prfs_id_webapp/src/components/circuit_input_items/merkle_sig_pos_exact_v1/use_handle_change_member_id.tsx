import React from "react";
import cn from "classnames";
import { treeApi } from "@taigalabs/prfs-api-js";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import {
  computeRoot,
  makePathIndices,
  makeSiblingPath,
  poseidon_2_bigint_le,
} from "@taigalabs/prfs-crypto-js";
import { hexlify } from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { GetPrfsTreeLeafIndicesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeLeafIndicesRequest";
import { GetPrfsTreeNodesByPosRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeNodesByPosRequest";
import {
  PrfsIdCredential,
  makeAtstCm,
  makeGroupMemberAtstClaimSecret,
} from "@taigalabs/prfs-id-sdk-web";
import { MerkleSigPosExactV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosExactV1Inputs";
import { SpartanMerkleProof } from "@taigalabs/prfs-circuit-interface/bindings/SpartanMerkleProof";
import { GetPrfsSetElementRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetElementRequest";
import { PrfsSetElementData } from "@taigalabs/prfs-entities/bindings/PrfsSetElementData";
import { bytesToNumberLE } from "@taigalabs/prfs-crypto-js";
import { MerkleSigPosExactV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosExactV1Data";
import { PrfsTree } from "@taigalabs/prfs-entities/bindings/PrfsTree";

import styles from "./MerkleSigPosExactInput.module.scss";
import { FormErrors } from "@/components/circuit_input_items/formTypes";
import { envs } from "@/envs";

export function useHandleChangeMemberId({
  credential,
  prfsSet,
  prfsTree,
  setMemberId,
  setFormErrors,
  setFormValues,
  proofAction,
  setExactValue,
}: UseHandleChangeAddressArgs) {
  const { mutateAsync: getPrfsSetElement } = useMutation({
    mutationFn: (req: GetPrfsSetElementRequest) => {
      return treeApi({ type: "get_prfs_set_element", ...req });
    },
  });

  const { mutateAsync: getPrfsTreeLeafIndices } = useMutation({
    mutationFn: (req: GetPrfsTreeLeafIndicesRequest) => {
      return treeApi({ type: "get_prfs_tree_leaf_indices", ...req });
    },
  });

  const { mutateAsync: getPrfsTreeNodesByPosRequest } = useMutation({
    mutationFn: (req: GetPrfsTreeNodesByPosRequest) => {
      return treeApi({ type: "get_prfs_tree_nodes_by_pos", ...req });
    },
  });

  return React.useCallback(
    async (memberId: string) => {
      if (!prfsSet) {
        return;
      }
      if (!prfsTree) {
        return;
      }
      if (!memberId) {
        return;
      }

      const { hashed: _memberIdHashed } = await makeAtstCm(credential.secret_key, memberId);
      const memberIdHashed = hexlify(_memberIdHashed);

      console.log(11, memberId, memberIdHashed);

      setMemberId(memberId);
      setFormErrors(prevVals => {
        return {
          ...prevVals,
          merkleProof: undefined,
        };
      });

      const { set_id, atst_group_id } = prfsSet;

      try {
        // Merkle setup
        const { payload: getPrfsSetElementPayload } = await getPrfsSetElement({
          set_id,
          label: memberIdHashed,
        });

        if (!getPrfsSetElementPayload) {
          function handleClick() {
            const url = `${envs.NEXT_PUBLIC_PRFS_CONSOLE_WEBAPP_ENDPOINT}/sets/${set_id}`;
            window.parent.window.open(url);
          }

          const elem = (
            <span>
              This member doesn't exist in {prfsSet.label}. Choose a different one or{" "}
              <button type="button" onClick={handleClick} className={styles.link}>
                add yours
              </button>{" "}
              to the set
            </span>
          );

          setFormErrors(oldVal => ({
            ...oldVal,
            merkleProof: elem,
          }));
          return;
        }

        const data = getPrfsSetElementPayload.prfs_set_element?.data as PrfsSetElementData;

        let sigR: bigint;
        let sigS: bigint;
        const args: bigint[] = [];

        await (async () => {
          const claimSecret = makeGroupMemberAtstClaimSecret(prfsSet.atst_group_id, memberId);
          const { hashed, sigBytes } = await makeAtstCm(credential.secret_key, claimSecret);
          sigR = bytesToNumberLE(sigBytes.subarray(0, 32));
          sigS = bytesToNumberLE(sigBytes.subarray(32, 64));

          const cm = hexlify(hashed);
          const cmInt = bytesToNumberLE(hashed);

          if (data.commitment !== cm) {
            throw new Error(`Commitment does not match, memberId: ${memberId}, \
        expected: ${data.commitment}, computed: ${cm}`);
          }

          args[0] = cmInt;
        })();

        args[1] = BigInt(data.value_int);

        const leafBytes = await poseidon_2_bigint_le(args);
        const leafVal = bytesToNumberLE(leafBytes);
        console.log("leafBytes: %o, args: %s, leafVal: %s, ", leafBytes, args, leafVal);

        const { payload, error } = await getPrfsTreeLeafIndices({
          tree_id: prfsTree.tree_id,
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
              merkleProof: `${memberId} is not part of a ${set_id}`,
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

        const root = await computeRoot(leafVal, siblings as bigint[], pathIndices);
        // console.log("root", root, prfsTree.merkle_root);
        if (BigInt(prfsTree.merkle_root) !== root) {
          setFormErrors((prevVals: any) => {
            return {
              ...prevVals,
              merkleProof: `Root does not match, computed: ${root}, given: ${prfsTree.merkle_root}`,
            };
          });
          return;
        }

        // Exact value setup
        setExactValue(args[1]);

        setFormValues(oldVal => ({
          ...oldVal,
          sigR,
          sigS,
          sigpos: args[0],
          leaf: leafVal,
          value: args[1],
          // assetSizeGreaterEqThan: lower_bound,
          // assetSizeLessThan: upper_bound,
          // assetSizeLabel: label,
          merkleProof,
          proofAction,
        }));
      } catch (err) {
        console.error(err);
      }
    },
    [
      setMemberId,
      setFormValues,
      prfsSet,
      getPrfsTreeLeafIndices,
      setFormErrors,
      getPrfsSetElement,
      prfsTree,
      proofAction,
    ],
  );
}

export interface UseHandleChangeAddressArgs {
  prfsSet: PrfsSet | null;
  prfsTree: PrfsTree | undefined;
  setMemberId: React.Dispatch<React.SetStateAction<string>>;
  circuitTypeData: MerkleSigPosExactV1Data;
  setFormValues: React.Dispatch<React.SetStateAction<MerkleSigPosExactV1Inputs>>;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors<MerkleSigPosExactV1Inputs>>>;
  credential: PrfsIdCredential;
  proofAction: string;
  setExactValue: React.Dispatch<React.SetStateAction<bigint>>;
}
