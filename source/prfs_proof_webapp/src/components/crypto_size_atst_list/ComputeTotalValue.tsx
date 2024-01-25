import React, { useId } from "react";
import { FaCalculator } from "@react-icons/all-files/fa/FaCalculator";
import { useMutation } from "@tanstack/react-query";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { atstApi } from "@taigalabs/prfs-api-js";
import { ComputeCryptoSizeTotalValuesRequest } from "@taigalabs/prfs-entities/bindings/ComputeCryptoSizeTotalValuesRequest";

import styles from "./ComputeTotalValue.module.scss";
import { i18nContext } from "@/i18n/context";
import { AttestationsTopMenu } from "@/components/sets/SetComponents";
import { useSignedInUser } from "@/hooks/user";
import { MASTER_ACCOUNT_ID } from "@/mock/mock_data";
import { LocalPrfsProofCredential } from "@/storage/local_storage";
import DialogDefault from "@/components/dialog_default/DialogDefault";

const Modal: React.FC<ModalProps> = ({ setIsOpen }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <p>{i18n.compute_total_asset_value_in_usd}</p>
      </div>
      <div className={styles.modalDesc}>
        <p>{i18n.this_might_take_minutes_or_longer}</p>
      </div>
      <div className={styles.modalBtnRow}>
        <Button variant="transparent_black_1" noTransition handleClick={() => {}} type="button">
          {i18n.close}
        </Button>
        <Button
          variant="blue_2"
          noTransition
          className={styles.computeBtn}
          handleClick={() => {}}
          noShadow
          type="button"
          // disabled={!validation || createStatus === Status.InProgress}
        >
          <div className={styles.content}>
            {/* <Spinner size={20} borderWidth={2} color={colors.white_100} /> */}
            <span>{i18n.compute}</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

const ComputeTotalValueDialog: React.FC<ComputeTotalValueDialogProps> = ({ credential }) => {
  const { prfsProofCredential } = useSignedInUser();
  const { mutateAsync: computeCryptoSizeTotalValuesRequest } = useMutation({
    mutationFn: (req: ComputeCryptoSizeTotalValuesRequest) => {
      return atstApi("compute_crypto_size_total_values", req);
    },
  });
  const handleClickCalculate = React.useCallback(async () => {
    if (prfsProofCredential) {
      const { payload } = await computeCryptoSizeTotalValuesRequest({
        account_id: prfsProofCredential.account_id,
      });

      console.log(123, payload);

      if (payload) {
      }
    }
  }, [prfsProofCredential, computeCryptoSizeTotalValuesRequest]);

  const createBase = React.useCallback((isOpen: boolean) => {
    return (
      <Button variant="circular_gray_1" handleClick={handleClickCalculate}>
        <FaCalculator />
      </Button>
    );
  }, []);

  const createModal = React.useCallback((setIsOpen: React.Dispatch<React.SetStateAction<any>>) => {
    return <Modal setIsOpen={setIsOpen} />;
  }, []);

  return (
    <>
      <DialogDefault createModal={createModal} createBase={createBase} />
    </>
  );
};

export default ComputeTotalValueDialog;

export interface ComputeTotalValueDialogProps {
  credential: LocalPrfsProofCredential;
}

export interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
