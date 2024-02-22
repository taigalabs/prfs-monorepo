import React from "react";
import cn from "classnames";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { FaTree } from "@react-icons/all-files/fa/FaTree";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { CreatePrfsTreeByPrfsSetRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsTreeByPrfsSetRequest";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { rand256Hex } from "@taigalabs/prfs-crypto-js";
import { abbrev5and5 } from "@taigalabs/prfs-ts-utils";

import styles from "./CreateTreeDialog.module.scss";
import common from "@/styles/common.module.scss";
import { i18nContext } from "@/i18n/context";
import { useSignedInUser } from "@/hooks/user";
import DialogDefault from "@/components/dialog_default/DialogDefault";
import {
  DefaultModalBtnRow,
  DefaultModalDesc,
  DefaultModalHeader,
  DefaultModalWrapper,
} from "@/components/dialog_default/DialogComponents";
import { CommonStatus } from "@/components/common_status/CommonStatus";
import { isMasterAccountId } from "@/mock/mock_data";

const CRYPTO_HOLDERS_SET_ID = "crypto_holders";

const Modal: React.FC<ModalProps> = ({
  setIsOpen,
  handleClickCreateTree,
  computeStatus,
  computeMsg,
}) => {
  const i18n = React.useContext(i18nContext);
  const handleClickClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  const handleClickOk = React.useCallback(() => {
    if (computeStatus === CommonStatus.Done) {
      setIsOpen(false);
    } else {
      handleClickCreateTree();
    }
  }, [handleClickCreateTree, computeStatus, setIsOpen]);

  return (
    <DefaultModalWrapper>
      <DefaultModalHeader>
        <p>{i18n.create_tree}</p>
      </DefaultModalHeader>
      <DefaultModalDesc>
        <p>{i18n.this_might_take_minutes_or_longer}</p>
        <div className={styles.computeMsg}>{computeMsg}</div>
      </DefaultModalDesc>
      <DefaultModalBtnRow>
        <Button
          variant="transparent_black_1"
          noTransition
          handleClick={handleClickClose}
          type="button"
        >
          {i18n.close}
        </Button>
        <Button
          variant="blue_2"
          noTransition
          className={styles.importBtn}
          handleClick={handleClickOk}
          noShadow
          type="button"
          disabled={computeStatus === CommonStatus.InProgress}
        >
          <div className={styles.importBtnContent}>
            <span>{computeStatus === CommonStatus.Done ? i18n.close : i18n.create}</span>
            {computeStatus === CommonStatus.InProgress && <Spinner size={14} borderWidth={2} />}
          </div>
        </Button>
      </DefaultModalBtnRow>
    </DefaultModalWrapper>
  );
};

const CreateTreeDialog: React.FC<ImportPrfsSetElementsDialogProps> = ({ rerender }) => {
  const i18n = React.useContext(i18nContext);
  const { mutateAsync: createTreeRequest } = useMutation({
    mutationFn: (req: CreatePrfsTreeByPrfsSetRequest) => {
      return prfsApi3({ type: "create_prfs_tree_by_prfs_set", ...req });
    },
  });
  const { prfsProofCredential } = useSignedInUser();
  const [isOpen, setIsOpen] = React.useState(false);
  const [computeStatus, setComputeStatus] = React.useState(CommonStatus.Standby);
  const [computeMsg, setComputeMsg] = React.useState<React.ReactNode>(null);
  const handleClickCreateTree = React.useCallback(async () => {
    if (prfsProofCredential && isMasterAccountId(prfsProofCredential.account_id)) {
      setComputeStatus(CommonStatus.InProgress);
      try {
        const hex = rand256Hex();

        const { payload, error } = await createTreeRequest({
          set_id: CRYPTO_HOLDERS_SET_ID,
          tree_id: hex,
          tree_label: `${CRYPTO_HOLDERS_SET_ID}__tree_${hex}`,
          account_id: prfsProofCredential.account_id,
        });

        if (error) {
          setComputeStatus(CommonStatus.Standby);
          setComputeMsg(
            <>
              <p className={common.redText}>{error.toString()}</p>
            </>,
          );
        }

        if (payload) {
          setComputeStatus(CommonStatus.Done);
          setComputeMsg(
            <>
              <p>
                <b>{i18n.tree} is created.</b>
              </p>
              <div className={styles.info}>
                <div>
                  <span className={styles.title}>{i18n.set_id}</span>
                  <span>{payload.set_id}</span>
                </div>
                <div>
                  <span className={styles.title}>{i18n.tree_id}</span>
                  <span>{abbrev5and5(payload.tree_id)}</span>
                </div>
              </div>
            </>,
          );
          rerender();
        }
      } catch (err: any) {
        setComputeStatus(CommonStatus.Standby);
        setComputeMsg(
          <>
            <p className={common.redText}>{err.toString()}</p>
          </>,
        );
      }
    }
  }, [prfsProofCredential, createTreeRequest, setComputeMsg, setComputeStatus, rerender]);

  const createBase = React.useCallback(() => {
    return (
      <Button
        variant="transparent_blue_2"
        noTransition
        type="button"
        disabled={!isMasterAccountId(prfsProofCredential?.account_id)}
      >
        <div className={styles.btnContent}>
          <FaTree />
          <span>{i18n.create_tree}</span>
        </div>
      </Button>
    );
  }, [prfsProofCredential]);

  React.useEffect(() => {
    if (isOpen) {
      setComputeStatus(CommonStatus.Standby);
      setComputeMsg(null);
    }
  }, [isOpen, setComputeMsg, setComputeStatus]);

  return (
    <>
      <DialogDefault isOpen={isOpen} setIsOpen={setIsOpen} createBase={createBase}>
        <Modal
          setIsOpen={setIsOpen}
          handleClickCreateTree={handleClickCreateTree}
          computeStatus={computeStatus}
          computeMsg={computeMsg}
        />
      </DialogDefault>
    </>
  );
};

export default CreateTreeDialog;

export interface ImportPrfsSetElementsDialogProps {
  rerender: () => void;
}

export interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClickCreateTree: () => void;
  computeStatus: CommonStatus;
  computeMsg: React.ReactNode;
}
