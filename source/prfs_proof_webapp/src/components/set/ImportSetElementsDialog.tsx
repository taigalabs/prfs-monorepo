"use client";

import React from "react";
import cn from "classnames";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { FaFileImport } from "@react-icons/all-files/fa/FaFileImport";
import { useMutation } from "@tanstack/react-query";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { ImportPrfsSetElementsRequest } from "@taigalabs/prfs-entities/bindings/ImportPrfsSetElementsRequest";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";

import styles from "./ImportSetElementsDialog.module.scss";
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
import { CommonStatus } from "../common_status/CommonStatus";

const PRFS_ATTESTATION = "prfs_attestation";
const CRYPTO_ASSET_SIZE_ATSTS = "crypto_asset_size_atsts";
const CRYPTO_HOLDERS_SET_ID = "crypto_holders";

const Modal: React.FC<ModalProps> = ({
  setIsOpen,
  handleClickImport,
  computeStatus,
  computeMsg,
}) => {
  const i18n = React.useContext(i18nContext);
  const handleClickClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  const handleClickOk = React.useCallback(() => {
    if (computeStatus === CommonStatus.Done) {
      window.location.reload();
    } else {
      handleClickImport();
    }
  }, [handleClickImport, computeStatus]);

  return (
    <DefaultModalWrapper>
      <DefaultModalHeader>
        <p>{i18n.import_prfs_set_elements_from_prfs_attestations}</p>
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
            <span>{computeStatus === CommonStatus.Done ? i18n.reload : i18n.import}</span>
            {computeStatus === CommonStatus.InProgress && <Spinner size={14} borderWidth={2} />}
          </div>
        </Button>
      </DefaultModalBtnRow>
    </DefaultModalWrapper>
  );
};

const ImportPrfsSetElementsDialog: React.FC<ImportPrfsSetElementsDialogProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { mutateAsync: importPrfsSetElementsRequest } = useMutation({
    mutationFn: (req: ImportPrfsSetElementsRequest) => {
      return prfsApi2("import_prfs_set_elements", req);
    },
  });
  const { prfsProofCredential } = useSignedInUser();
  const [isOpen, setIsOpen] = React.useState(false);
  const [computeStatus, setComputeStatus] = React.useState(CommonStatus.Standby);
  const [computeMsg, setComputeMsg] = React.useState<React.ReactNode>(null);
  const handleClickImport = React.useCallback(async () => {
    if (prfsProofCredential && prfsProofCredential.account_id === MASTER_ACCOUNT_ID) {
      setComputeStatus(CommonStatus.InProgress);
      try {
        const { payload, error } = await importPrfsSetElementsRequest({
          src_type: PRFS_ATTESTATION,
          src_id: CRYPTO_ASSET_SIZE_ATSTS,
          dest_set_id: CRYPTO_HOLDERS_SET_ID,
        });

        if (payload) {
          setComputeStatus(CommonStatus.Done);
          setComputeMsg(
            <>
              <p>
                <b>Imported, row count: {payload.rows_affected.toString()}</b>
              </p>
              <p>Reload the page</p>
            </>,
          );
        }

        if (error) {
          setComputeStatus(CommonStatus.Standby);
          setComputeMsg(
            <>
              <p className={common.redText}>{error}</p>
            </>,
          );
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
  }, [prfsProofCredential, importPrfsSetElementsRequest, setComputeMsg, setComputeStatus]);

  const createBase = React.useCallback(() => {
    return (
      <Button
        variant="transparent_blue_2"
        noTransition
        type="button"
        disabled={prfsProofCredential?.account_id !== MASTER_ACCOUNT_ID}
      >
        <div className={styles.btnContent}>
          <FaFileImport />
          <span>{i18n.import_from} crypto_size_attestations</span>
        </div>
      </Button>
    );
  }, [prfsProofCredential]);

  return (
    <>
      <DialogDefault isOpen={isOpen} setIsOpen={setIsOpen} createBase={createBase}>
        <Modal
          setIsOpen={setIsOpen}
          handleClickImport={handleClickImport}
          computeStatus={computeStatus}
          computeMsg={computeMsg}
        />
      </DialogDefault>
    </>
  );
};

export default ImportPrfsSetElementsDialog;

export interface ImportPrfsSetElementsDialogProps {}

export interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClickImport: () => {};
  computeStatus: CommonStatus;
  computeMsg: React.ReactNode;
}
