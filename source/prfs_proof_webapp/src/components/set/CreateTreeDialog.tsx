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

const PRFS_ATTESTATION = "prfs_attestation";
const CRYPTO_ASSET_SIZE_ATSTS = "crypto_asset_size_atsts";
const CRYPTO_HOLDERS_SET_ID = "crypto_holders";

enum Status {
  Standby,
  InProgress,
  Done,
}

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
    if (computeStatus === Status.Done) {
      window.location.reload();
    } else {
      handleClickCreate();
    }
  }, [handleClickCreate, computeStatus]);

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
          disabled={computeStatus === Status.InProgress}
        >
          <div className={styles.importBtnContent}>
            <span>{computeStatus === Status.Done ? i18n.reload : i18n.create}</span>
            <Spinner size={14} borderWidth={2} />
            {computeStatus === Status.InProgress && <Spinner size={14} borderWidth={2} />}
          </div>
        </Button>
      </DefaultModalBtnRow>
    </DefaultModalWrapper>
  );
};

const CreateTreeDialog: React.FC<ImportPrfsSetElementsDialogProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { mutateAsync: createTreeRequest } = useMutation({
    mutationFn: (req: CreateTreeOfPrfsSetRequest) => {
      return prfsApi2("create_tree_of_prfs_set", req);
    },
  });
  const { prfsProofCredential } = useSignedInUser();
  const [isOpen, setIsOpen] = React.useState(false);
  const [computeStatus, setComputeStatus] = React.useState(Status.Standby);
  const [computeMsg, setComputeMsg] = React.useState<React.ReactNode>(null);
  const handleClickCreate = React.useCallback(async () => {
    if (prfsProofCredential && prfsProofCredential.account_id === MASTER_ACCOUNT_ID) {
      setComputeStatus(Status.InProgress);
      try {
        const { payload, error } = await createTreeRequest({
          set_id: CRYPTO_HOLDERS_SET_ID,
          account_id: prfsProofCredential.account_id,
        });

        if (payload) {
          setComputeStatus(Status.Done);
          setComputeMsg(
            <>
              <p>{/* <b>Imported, row count: {payload.rows_affected.toString()}</b> */}</p>
              <p>Reload the page</p>
            </>,
          );
        }

        if (error) {
          setComputeStatus(Status.Standby);
          setComputeMsg(
            <>
              <p className={common.redText}>{error}</p>
            </>,
          );
        }
      } catch (err: any) {
        setComputeStatus(Status.Standby);
        setComputeMsg(
          <>
            <p className={common.redText}>{err.toString()}</p>
          </>,
        );
      }
    }
  }, [prfsProofCredential, createTreeRequest, setComputeMsg, setComputeStatus]);

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

export interface ImportPrfsSetElementsDialogProps {}

export interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClickCreate: () => {};
  computeStatus: Status;
  computeMsg: React.ReactNode;
}
