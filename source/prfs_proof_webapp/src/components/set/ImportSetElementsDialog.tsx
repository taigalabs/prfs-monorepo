"use client";

import React from "react";
import cn from "classnames";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { FaFileImport } from "@react-icons/all-files/fa/FaFileImport";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { prfsApi3, treeApi } from "@taigalabs/prfs-api-js";
import { ImportPrfsAttestationsToPrfsSetRequest } from "@taigalabs/prfs-entities/bindings/ImportPrfsAttestationsToPrfsSetRequest";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";

import styles from "./ImportSetElementsDialog.module.scss";
import common from "@/styles/common.module.scss";
import { i18nContext } from "@/i18n/context";
import { useSignedInProofUser } from "@/hooks/user";
import DialogDefault from "@/components/dialog_default/DialogDefault";
import {
  DefaultModalBtnRow,
  DefaultModalDesc,
  DefaultModalHeader,
  DefaultModalWrapper,
} from "@/components/dialog_default/DialogComponents";
import { CommonStatus } from "@/components/common_status/CommonStatus";
import { isMasterAccountId } from "@/mock/mock_data";

const PRFS_ATTESTATION = "prfs_attestation";
const CRYPTO_ASSET_SIZE_ATSTS = "crypto_asset_size_atsts";
const CRYPTO_HOLDERS_SET_ID = "crypto_holders";
const CRYPTO_1 = "crypto_1";

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
      setIsOpen(false);
    } else {
      handleClickImport();
    }
  }, [setIsOpen, handleClickImport, computeStatus]);

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
            <span>{computeStatus === CommonStatus.Done ? i18n.close : i18n.import}</span>
            {computeStatus === CommonStatus.InProgress && <Spinner size={14} borderWidth={2} />}
          </div>
        </Button>
      </DefaultModalBtnRow>
    </DefaultModalWrapper>
  );
};

const ImportPrfsSetElementsDialog: React.FC<ImportPrfsSetElementsDialogProps> = ({ rerender }) => {
  const i18n = React.useContext(i18nContext);
  const { mutateAsync: importPrfsSetElementsRequest } = useMutation({
    mutationFn: (req: ImportPrfsAttestationsToPrfsSetRequest) => {
      return treeApi({ type: "import_prfs_attestations_to_prfs_set", ...req });
    },
  });
  const { prfsProofCredential } = useSignedInProofUser();
  const [isOpen, setIsOpen] = React.useState(false);
  const [computeStatus, setComputeStatus] = React.useState(CommonStatus.Standby);
  const [computeMsg, setComputeMsg] = React.useState<React.ReactNode>(null);
  const handleClickImport = React.useCallback(async () => {
    if (prfsProofCredential && isMasterAccountId(prfsProofCredential.account_id)) {
      setComputeStatus(CommonStatus.InProgress);
      try {
        const { payload, error } = await importPrfsSetElementsRequest({
          topic: CRYPTO_1,
          dest_set_id: CRYPTO_HOLDERS_SET_ID,
        });

        if (payload) {
          setComputeStatus(CommonStatus.Done);
          setComputeMsg(
            <>
              <p>
                <b>Imported, new row count: {payload.rows_affected.toString()}</b>
              </p>
            </>,
          );
          rerender();
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
  }, [
    prfsProofCredential,
    importPrfsSetElementsRequest,
    setComputeMsg,
    setComputeStatus,
    rerender,
  ]);

  React.useEffect(() => {
    if (isOpen) {
      setComputeStatus(CommonStatus.Standby);
      setComputeMsg(null);
    }
  }, [isOpen, setComputeMsg, setComputeStatus]);

  const createBase = React.useCallback(() => {
    return (
      <Button
        variant="transparent_blue_2"
        noTransition
        type="button"
        disabled={!isMasterAccountId(prfsProofCredential?.account_id)}
      >
        <div className={styles.btnContent}>
          <FaFileImport />
          <span>
            {i18n.import_from} {i18n.prfs_attestations} (type: {CRYPTO_1})
          </span>
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

export interface ImportPrfsSetElementsDialogProps {
  rerender: () => void;
}

export interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClickImport: () => {};
  computeStatus: CommonStatus;
  computeMsg: React.ReactNode;
}
