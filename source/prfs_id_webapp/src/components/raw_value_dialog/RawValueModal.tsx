import React from "react";
import cn from "classnames";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import Input from "@taigalabs/prfs-react-lib/src/input/Input";

import styles from "./RawValueModal.module.scss";
import { useI18N } from "@/i18n/context";
import { useAppSelector } from "@/state/hooks";

const RawValueModal: React.FC<CachedItemModalProps> = ({
  prfsSet,
  handleClickClose,
  handleChangeValue,
}) => {
  const prfsIdCredential = useAppSelector(state => state.user.prfsIdCredential);
  const i18n = useI18N();
  const [value, setValue] = React.useState("");

  const extendedHandleChangeValue = React.useCallback(() => {}, [handleChangeValue]);

  return prfsIdCredential ? (
    <div className={styles.wrapper}>
      <Input name={""} label={i18n.member_id} value={value} readOnly />
      <div className={styles.btnRow}>
        <Button variant="transparent_aqua_blue_1" handleClick={handleClickClose}>
          {i18n.close}
        </Button>
        <Button variant="blue_3" handleClick={extendedHandleChangeValue}>
          {i18n.submit}
        </Button>
      </div>
    </div>
  ) : (
    <div>Credential is empty. Something is wrong</div>
  );
};

export default RawValueModal;

export interface CachedItemModalProps {
  prfsSet: PrfsSet;
  handleClickClose: () => void;
  handleChangeValue: (addr: string) => void;
}
