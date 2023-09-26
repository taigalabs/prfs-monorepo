import React from "react";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { ethers } from "ethers";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { Msg, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import { SpartanMerkleProof } from "@taigalabs/prfs-driver-spartan-js";
import {
  useFloating,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  useId,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
} from "@floating-ui/react";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import { useAccount } from "wagmi";

import styles from "./MerkleProofInput.module.scss";
import MerkleProofDialog from "./MerkleProofDialog";
import { i18nContext } from "@/contexts/i18n";
import { useAppDispatch } from "@/state/hooks";
import { FormInput, FormInputTitleRow } from "../form_input/FormInput";
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";
import { useMutation } from "@tanstack/react-query";
import { GetPrfsTreeLeafIndicesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeLeafIndicesRequest";
import { GetPrfsSetBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetBySetIdRequest";

const MerkleProofInput: React.FC<MerkleProofInputProps> = ({
  circuitInput,
  value,
  setFormValues,
  zIndex,
}) => {
  const i18n = React.useContext(i18nContext);
  const [prfsSet, setPrfsSet] = React.useState<PrfsSet>();
  const [isOpen, setIsOpen] = React.useState(false);
  const [walletAddr, setWalletAddr] = React.useState("");
  const dispatch = useAppDispatch();
  const { address, isConnected } = useAccount();

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

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const click = useClick(context);
  const role = useRole(context);
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" });

  const { getReferenceProps, getFloatingProps } = useInteractions([click, role, dismiss]);

  const headingId = useId();
  const descriptionId = useId();

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

        setPrfsSet(payload.prfs_set);
      } else {
        console.error("Prfs set not found");
      }
    }
    fn().then();
  }, [circuitInput, setPrfsSet, getPrfsSetBySetId]);

  const handleClickSubmit = React.useCallback(
    (merkleProof: SpartanMerkleProof) => {
      setFormValues((prevVals: any) => {
        return {
          ...prevVals,
          [circuitInput.name]: merkleProof,
        };
      });

      setIsOpen(false);
    },
    [setFormValues, setIsOpen]
  );

  const handleClickGetAddress = React.useCallback(async () => {
    console.log(222, prfsSet, address);

    if (!prfsSet) {
      return;
    }

    if (!address) {
      return;
    }

    const { set_id } = prfsSet;

    try {
      const { payload } = await GetPrfsTreeLeafIndices({
        set_id,
        leaf_vals: [address],
      });

      let pos_w = null;
      for (const node of payload.prfs_tree_nodes) {
        if (node.val === address.toLowerCase()) {
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

      console.log("leafIdx: %o, siblingPos: %o", leafIdx, siblingPos);

      const siblingNodesData = await prfsApi2("get_prfs_tree_nodes_by_pos", {
        set_id,
        pos: siblingPos,
      });

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
        root: BigInt(prfsSet.merkle_root),
        siblings: siblings as bigint[],
        pathIndices,
      };

      setFormValues((prevVals: any) => {
        return {
          ...prevVals,
          [circuitInput.name]: merkleProof,
        };
      });

      setWalletAddr(address);
    } catch (err) {
      console.error(err);
    }
  }, [setWalletAddr, setFormValues, prfsSet, GetPrfsTreeLeafIndices]);

  return (
    prfsSet && (
      <FormInput>
        <FormInputTitleRow>
          <div>
            <p className={styles.title}>
              {circuitInput.label}
              <span className={styles.setLabel}>({prfsSet.label})</span>
            </p>
          </div>
          <div>
            <div>
              <div className={styles.btnGroup} ref={refs.setReference} {...getReferenceProps()}>
                <button>{i18n.raw}</button>
              </div>
              <FloatingPortal>
                {isOpen && (
                  <FloatingOverlay style={{ zIndex: zIndex || 200 }}>
                    <Fade className={styles.fadeOverlay}>
                      <FloatingFocusManager context={context}>
                        <div
                          className={styles.dialog}
                          ref={refs.setFloating}
                          aria-labelledby={headingId}
                          aria-describedby={descriptionId}
                          {...getFloatingProps()}
                        >
                          <MerkleProofDialog
                            prfsSet={prfsSet}
                            circuitInput={circuitInput}
                            handleClickSubmit={handleClickSubmit}
                            setIsOpen={setIsOpen}
                          />
                        </div>
                      </FloatingFocusManager>
                    </Fade>
                  </FloatingOverlay>
                )}
              </FloatingPortal>
            </div>
          </div>
        </FormInputTitleRow>
        <div className={styles.wrapper}>
          <input placeholder={`${circuitInput.desc}`} value={walletAddr} readOnly />
          <div className={styles.btnGroup}>
            <button onClick={handleClickGetAddress}>{i18n.put_address}</button>
          </div>
        </div>
      </FormInput>
    )
  );
};

export default MerkleProofInput;

export interface MerkleProofInputProps {
  circuitInput: CircuitInput;
  value: SpartanMerkleProof | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  zIndex?: number;
}
