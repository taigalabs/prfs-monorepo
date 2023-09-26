import React from "react";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import { RiEqualizerLine } from "@react-icons/all-files/ri/RiEqualizerLine";
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
import { GetPrfsTreeLeafIndicesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeLeafIndicesRequest";
import { GetPrfsSetBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetBySetIdRequest";

import styles from "./WalletDialog.module.scss";
import Fade from "../fade/Fade";
import Button from "../button/Button";
import { i18nContext } from "../contexts/i18nContext";
import WalletModal from "./WalletModal";

const WalletDialog: React.FC<WalletDialogProps> = ({
  // circuitInput,
  // value,
  // setFormValues,
  zIndex,
}) => {
  const i18n = React.useContext(i18nContext);
  const [prfsSet, setPrfsSet] = React.useState<PrfsSet>();
  const [isOpen, setIsOpen] = React.useState(false);
  const [walletAddr, setWalletAddr] = React.useState("");
  // const dispatch = useAppDispatch();
  // const { address, isConnected } = useAccount();

  // const { mutateAsync: GetPrfsTreeLeafIndices } = useMutation({
  //   mutationFn: (req: GetPrfsTreeLeafIndicesRequest) => {
  //     return prfsApi2("get_prfs_tree_leaf_indices", req);
  //   },
  // });

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

  // const handleClickSubmit = React.useCallback(
  //   (merkleProof: SpartanMerkleProof) => {
  //     setFormValues((prevVals: any) => {
  //       return {
  //         ...prevVals,
  //         [circuitInput.name]: merkleProof,
  //       };
  //     });

  //     setIsOpen(false);
  //   },
  //   [setFormValues, setIsOpen]
  // );

  // const handleClickGetAddress = React.useCallback(async () => {
  //   console.log(222, prfsSet, address);

  //   if (!prfsSet) {
  //     return;
  //   }

  //   if (!address) {
  //     return;
  //   }

  //   const { set_id } = prfsSet;

  //   try {
  //     const { payload } = await GetPrfsTreeLeafIndices({
  //       set_id,
  //       leaf_vals: [address],
  //     });

  //     let pos_w = null;
  //     for (const node of payload.prfs_tree_nodes) {
  //       if (node.val === address.toLowerCase()) {
  //         pos_w = node.pos_w;
  //       }
  //     }

  //     if (pos_w === null) {
  //       throw new Error("Address is not part of a set");
  //     }

  //     const leafIdx = Number(pos_w);
  //     const siblingPath = makeSiblingPath(32, leafIdx);
  //     const pathIndices = makePathIndices(32, leafIdx);

  //     const siblingPos = siblingPath.map((pos_w, idx) => {
  //       return { pos_h: idx, pos_w };
  //     });

  //     console.log("leafIdx: %o, siblingPos: %o", leafIdx, siblingPos);

  //     const siblingNodesData = await prfsApi2("get_prfs_tree_nodes_by_pos", {
  //       set_id,
  //       pos: siblingPos,
  //     });

  //     let siblings: BigInt[] = [];
  //     for (const node of siblingNodesData.payload.prfs_tree_nodes) {
  //       siblings[node.pos_h] = BigInt(node.val);
  //     }

  //     for (let idx = 0; idx < 32; idx += 1) {
  //       if (siblings[idx] === undefined) {
  //         siblings[idx] = BigInt(0);
  //       }
  //     }

  //     const merkleProof: SpartanMerkleProof = {
  //       root: BigInt(prfsSet.merkle_root),
  //       siblings: siblings as bigint[],
  //       pathIndices,
  //     };

  //     setFormValues((prevVals: any) => {
  //       return {
  //         ...prevVals,
  //         [circuitInput.name]: merkleProof,
  //       };
  //     });

  //     // setWalletAddr(address);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, [setWalletAddr, setFormValues, prfsSet]);

  return (
    <div>
      <div>
        <div>
          <div className={styles.btnRow} ref={refs.setReference} {...getReferenceProps()}>
            <button>{i18n.put_address}</button>
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
                      <WalletModal />
                    </div>
                  </FloatingFocusManager>
                </Fade>
              </FloatingOverlay>
            )}
          </FloatingPortal>
        </div>
      </div>
    </div>
  );
};

export default WalletDialog;

export interface WalletDialogProps {
  // circuitInput: CircuitInput;
  // value: SpartanMerkleProof | undefined;
  // setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  zIndex?: number;
}
