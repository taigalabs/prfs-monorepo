import React from "react";
import cn from "classnames";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { FaTree } from "@react-icons/all-files/fa/FaTree";
import { useMutation } from "@tanstack/react-query";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { CreateTreeOfPrfsSetRequest } from "@taigalabs/prfs-entities/bindings/CreateTreeOfPrfsSetRequest";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";

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
import { MASTER_ACCOUNT_ID } from "@/mock/mock_data";
import { CommonStatus } from "@/components/common_status/CommonStatus";

const CRYPTO_HOLDERS_SET_ID = "crypto_holders";

const Modal: React.FC<ModalProps> = ({
  setIsOpen,
  handleClickCreate,
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
      handleClickCreate();
    }
  }, [handleClickCreate, computeStatus, setIsOpen]);

  return (
    <DefaultModalWrapper>
      <DefaultModalHeader>
        <p>{i18n.create_tree}</p>
      </DefaultModalHeader>
      <DefaultModalDesc>
        <p>{i18n.this_might_take_minutes_or_longer}</p>
        <div className={styles.msg}>{computeMsg}</div>
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

const CreateTreeDialog: React.FC<ImportPrfsSetElementsDialogProps> = ({ handleSucceedCreate }) => {
  const i18n = React.useContext(i18nContext);
  const { mutateAsync: createTreeRequest } = useMutation({
    mutationFn: (req: CreateTreeOfPrfsSetRequest) => {
      return prfsApi2("create_tree_of_prfs_set", req);
    },
  });
  const { prfsProofCredential } = useSignedInUser();
  const [isOpen, setIsOpen] = React.useState(false);
  const [computeStatus, setComputeStatus] = React.useState(CommonStatus.Standby);
  const [computeMsg, setComputeMsg] = React.useState<React.ReactNode>(null);
  const handleClickCreate = React.useCallback(async () => {
    if (prfsProofCredential && prfsProofCredential.account_id === MASTER_ACCOUNT_ID) {
      setComputeStatus(CommonStatus.InProgress);
      try {
        const { payload, error } = await createTreeRequest({
          set_id: CRYPTO_HOLDERS_SET_ID,
          account_id: prfsProofCredential.account_id,
        });

        if (error) {
          setComputeStatus(CommonStatus.Standby);
          setComputeMsg(
            <>
              <p className={common.redText}>{error}</p>
            </>,
          );
        }

        if (payload) {
          setComputeStatus(CommonStatus.Done);
          setComputeMsg(
            <>
              <p>
                <b>{i18n.finished_importing}</b>
              </p>
            </>,
          );
          handleSucceedCreate();
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
  }, [
    prfsProofCredential,
    createTreeRequest,
    setComputeMsg,
    setComputeStatus,
    handleSucceedCreate,
  ]);

  const createBase = React.useCallback(() => {
    return (
      <Button
        variant="transparent_blue_2"
        noTransition
        type="button"
        disabled={prfsProofCredential?.account_id !== MASTER_ACCOUNT_ID}
      >
        <div className={styles.btnContent}>
          <FaTree />
          <span>{i18n.create_tree}</span>
        </div>
      </Button>
    );
  }, [prfsProofCredential]);

  return (
    <>
      <DialogDefault isOpen={isOpen} setIsOpen={setIsOpen} createBase={createBase}>
        <Modal
          setIsOpen={setIsOpen}
          handleClickCreate={handleClickCreate}
          computeStatus={computeStatus}
          computeMsg={computeMsg}
        />
      </DialogDefault>
    </>
  );
};

export default CreateTreeDialog;

export interface ImportPrfsSetElementsDialogProps {
  handleSucceedCreate: () => void;
}

export interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClickCreate: () => void;
  computeStatus: CommonStatus;
  computeMsg: React.ReactNode;
}
